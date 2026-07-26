import { readFile } from 'node:fs/promises';

import { describe, expect, it, vi } from 'vitest';

import { createCourseArtifact, teachSkillMappings } from '../src/index.js';

type Json = Record<string, unknown>;
type Discovery = { candidates: unknown[]; uses: unknown[]; gaps: unknown[] };

const fixture = async (): Promise<Json> => JSON.parse(
  await readFile(new URL('../../contracts/test/fixtures/course-artifact.v1.json', import.meta.url), 'utf8'),
) as Json;

const clone = <T>(value: T): T => structuredClone(value);

const input = (sourceDiscovery: Discovery) => ({
  intake: {
    goal: 'Hold a short Malay greeting conversation with family.',
    availableMinutesPerDay: 20,
  },
  sourceDiscovery,
  learnerState: {
    learnerId: 'learner-luke',
    priorNotes: 'Knows basic Japanese.',
  },
});

const discoveryFrom = (artifact: Json): Discovery => ({
  candidates: clone(artifact.sourceCandidates as unknown[]),
  uses: clone(artifact.sourceUses as unknown[]),
  gaps: clone(artifact.sourceGaps as unknown[]),
});

describe('@openbook/course-agent createCourseArtifact', () => {
  it('deterministically turns intake and discovered evidence into a validated declarative artifact without losing evidence', async () => {
    const artifact = await fixture();
    const discovery = discoveryFrom(artifact);
    const generator = vi.fn(async () => clone(artifact));

    const first = await createCourseArtifact(input(discovery), generator);
    const second = await createCourseArtifact(input(discovery), generator);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      learner: { goal: input(discovery).intake.goal, availableMinutesPerDay: 20 },
      sourceCandidates: discovery.candidates,
      sourceUses: discovery.uses,
      sourceGaps: discovery.gaps,
    });
    expect(first.lessons[0]?.page.blocks.every((block) => !('script' in block) && !('attributes' in block))).toBe(true);
    expect(generator).toHaveBeenCalledTimes(2);
  });

  it('rejects an invalid intake before invoking the generator', async () => {
    const artifact = await fixture();
    const generator = vi.fn(async () => artifact);

    await expect(createCourseArtifact({
      ...input(discoveryFrom(artifact)),
      intake: { goal: '', availableMinutesPerDay: 0 },
    }, generator)).rejects.toThrow(/goal|minutes/i);
    expect(generator).not.toHaveBeenCalled();
  });

  it('rejects generated lesson material that has neither a source use nor an explicit source gap', async () => {
    const artifact = await fixture();
    const unsupported = clone(artifact) as Json & { sourceUses: unknown[]; sourceGaps: unknown[] };
    unsupported.sourceUses = [];
    unsupported.sourceGaps = [];

    await expect(createCourseArtifact(input(discoveryFrom(unsupported)), async () => unsupported))
      .rejects.toThrow(/source use|source gap|evidence/i);
  });

  it('rejects generated executable or raw page fields through the public contract boundary', async () => {
    const artifact = await fixture();
    const unsafe = clone(artifact) as Json & { lessons: Array<{ page: { blocks: Json[] } }> };
    unsafe.lessons[0]!.page.blocks[0]!.script = 'alert("not declarative")';

    await expect(createCourseArtifact(input(discoveryFrom(artifact)), async () => unsafe)).rejects.toThrow();
  });

  it('publishes the Teach-skill mapping as application concepts, never a runtime dependency', () => {
    expect(teachSkillMappings).toMatchObject({ runtimeDependency: false });
    expect(Object.fromEntries(teachSkillMappings.mappings.map(({ teachConcept, openBookRecord }) => [teachConcept, openBookRecord])))
      .toMatchObject({
        'MISSION.md / context': 'journey goal / context',
        'RESOURCES.md': 'source candidate / use / gap',
        'learning records / notes': 'learner state / preferences',
        'lesson HTML': 'declarative HtmlPageSpec',
        'shared assets': 'later stable-component catalog input',
      });
  });
});
