import { readFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createOpenAI, generateObject, jsonSchema } = vi.hoisted(() => ({
  createOpenAI: vi.fn(),
  generateObject: vi.fn(),
  jsonSchema: vi.fn((schema: unknown) => schema),
}));

vi.mock('@ai-sdk/openai', () => ({ createOpenAI }));
vi.mock('ai', () => ({ generateObject, jsonSchema }));

import {
  createCourseArtifact,
  createOpenAICourseArtifactGenerator,
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
  learnerState: { learnerId: 'learner-luke' },
});

describe('@openbook/course-agent OpenAI provider adapter', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  it('rejects a missing OPENAI_API_KEY before creating a model or issuing a request', () => {
    expect(() => createOpenAICourseArtifactGenerator()).toThrow(/OPENAI_API_KEY/i);
    expect(createOpenAI).not.toHaveBeenCalled();
    expect(generateObject).not.toHaveBeenCalled();
  });

  it('returns model output through application-owned evidence merge and CourseArtifact validation', async () => {
    const artifact = await fixture();
    const modelArtifact = clone(artifact) as Json & {
      learner: { goal: string; availableMinutesPerDay: number };
      sourceCandidates: unknown[];
      sourceUses: unknown[];
      sourceGaps: unknown[];
    };
    modelArtifact.learner = { goal: 'Ignore the learner.', availableMinutesPerDay: 1 };
    modelArtifact.sourceCandidates = [];
    modelArtifact.sourceUses = [];
    modelArtifact.sourceGaps = [];
    const model = vi.fn(() => ({ modelId: 'gpt-test' }));
    createOpenAI.mockReturnValue(model);
    generateObject.mockResolvedValue({ object: modelArtifact });

    const generated = await createCourseArtifact(
      input(artifact),
      createOpenAICourseArtifactGenerator({ apiKey: 'test-key', model: 'gpt-test' }),
    );

    expect(createOpenAI).toHaveBeenCalledWith({ apiKey: 'test-key' });
    expect(model).toHaveBeenCalledWith('gpt-test');
    expect(jsonSchema).toHaveBeenCalledOnce();
    expect(generateObject).toHaveBeenCalledOnce();
    const request = generateObject.mock.calls[0]?.[0] as { schemaName: string; system: string };
    expect(request.schemaName).toBe('course_artifact');
    expect(request.system).toMatch(/declarative HtmlPageSpec/i);
    expect(request.system).toMatch(/source gap before making the unsupported instructional claim/i);
    expect(generated).toMatchObject({
      learner: { goal: input(artifact).intake.goal, availableMinutesPerDay: 20 },
      sourceCandidates: artifact.sourceCandidates,
      sourceUses: artifact.sourceUses,
      sourceGaps: artifact.sourceGaps,
    });
  });

  it('reports invalid model output through the existing CourseArtifact validation boundary', async () => {
    const artifact = await fixture();
    createOpenAI.mockReturnValue(vi.fn(() => ({ modelId: 'gpt-test' })));
    generateObject.mockResolvedValue({ object: { title: 'not a course artifact' } });

    await expect(createCourseArtifact(
      input(artifact),
      createOpenAICourseArtifactGenerator({ apiKey: 'test-key' }),
    )).rejects.toThrow(/Course Artifact|schema|versioned/i);
    expect(generateObject).toHaveBeenCalledOnce();
  });
});
