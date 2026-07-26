import { readFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { OpenAI, create } = vi.hoisted(() => ({
  OpenAI: vi.fn(),
  create: vi.fn(),
}));

vi.mock('openai', () => ({ default: OpenAI }));

import {
  createCourseArtifact,
  createDeepSeekCourseArtifactGenerator,
  DeepSeekCourseGeneratorError,
  type CreateCourseArtifactInput,
} from '../src/index.js';

type Json = Record<string, unknown>;

const fixture = async (): Promise<Json> => JSON.parse(
  await readFile(new URL('../../contracts/test/fixtures/course-artifact.v1.json', import.meta.url), 'utf8'),
) as Json;

const clone = <T>(value: T): T => structuredClone(value);

const input = (artifact: Json): CreateCourseArtifactInput => ({
  intake: {
    goal: 'Hold a short Malay greeting conversation with family.',
    availableMinutesPerDay: 20,
  },
  sourceDiscovery: {
    candidates: clone(artifact.sourceCandidates as unknown[]),
    uses: clone(artifact.sourceUses as unknown[]),
    gaps: clone(artifact.sourceGaps as unknown[]),
  },
  learnerState: {
    learnerId: 'learner-luke',
    priorNotes: 'Private note that must not leave this device.',
    preferences: { privatePreference: 'Do not send this value.' },
  },
});

describe('@openbook/course-agent DeepSeek provider adapter', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.DEEPSEEK_API_KEY;
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));
  });

  it('rejects a missing DEEPSEEK_API_KEY before creating a client or issuing a request', () => {
    expect(() => createDeepSeekCourseArtifactGenerator()).toThrow(/DEEPSEEK_API_KEY/i);
    expect(OpenAI).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('uses DeepSeek JSON mode and sends only the documented minimal learning input', async () => {
    const artifact = await fixture();
    create.mockResolvedValue({ choices: [{ message: { content: JSON.stringify(artifact) } }] });

    const generated = await createCourseArtifact(
      input(artifact),
      createDeepSeekCourseArtifactGenerator({ apiKey: 'test-key' }),
    );

    expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'test-key', baseURL: 'https://api.deepseek.com' });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      model: 'deepseek-v4-flash',
      response_format: { type: 'json_object' },
      stream: false,
    }));
    const request = create.mock.calls[0]?.[0] as { messages: Array<{ content: string }> };
    const systemMessage = request.messages[0]?.content ?? '';
    const userMessage = request.messages[1]?.content ?? '';
    expect(systemMessage).toContain('Output JSON Schema');
    expect(systemMessage).toContain('"schemaVersion"');
    expect(JSON.parse(userMessage)).toEqual({
      intake: input(artifact).intake,
      sourceDiscovery: input(artifact).sourceDiscovery,
    });
    expect(generated.learner).toEqual({ goal: input(artifact).intake.goal, availableMinutesPerDay: 20 });
  });

  it.each([null, '', '   '])('raises a typed retryable error when JSON mode returns empty content: %j', async (content) => {
    const artifact = await fixture();
    create.mockResolvedValue({ choices: [{ message: { content } }] });

    await expect(createCourseArtifact(
      input(artifact),
      createDeepSeekCourseArtifactGenerator({ apiKey: 'test-key' }),
    )).rejects.toMatchObject({
      code: 'EMPTY_CONTENT',
      retryable: true,
    } satisfies Partial<DeepSeekCourseGeneratorError>);
  });

  it('preserves the application contract boundary after parsing JSON mode output', async () => {
    const artifact = await fixture();
    create.mockResolvedValue({ choices: [{ message: { content: JSON.stringify({ title: 'not an artifact' }) } }] });

    await expect(createCourseArtifact(
      input(artifact),
      createDeepSeekCourseArtifactGenerator({ apiKey: 'test-key' }),
    )).rejects.toThrow(/Course Artifact|schema|versioned/i);
  });
});
