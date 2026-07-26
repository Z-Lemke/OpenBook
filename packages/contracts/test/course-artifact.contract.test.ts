import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

import {
  ContractValidationError,
  courseArtifactSchema,
  learnerCommandSchema,
  validateCourseArtifact,
  validateLearnerCommand,
} from '../src/index.js';

type JsonObject = Record<string, unknown>;

const fixture = async <T>(name: string): Promise<T> =>
  JSON.parse(await readFile(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')) as T;

describe('@openbook/contracts Course Artifact v1', () => {
  it('accepts the versioned fixture, declarative pages, source evidence, and root lineage', async () => {
    const artifact = await fixture<JsonObject>('course-artifact.v1.json');
    const validated = validateCourseArtifact(artifact);

    expect(validated).toEqual(artifact);
    expect(courseArtifactSchema.$id).toContain('course-artifact/v1');
    expect(validated.schemaVersion).toBe('course-artifact/v1');
    expect(validated.revision).toBe(1);
    expect(validated.predecessorArtifactId).toBeNull();
    expect(validated.sourceCandidates).toHaveLength(1);
    expect(validated.sourceUses).toHaveLength(1);
    expect(validated.sourceGaps).toHaveLength(1);
  });

  it.each([
    ['script', "alert('not declarative')"],
    ['attributes', { onClick: 'steal()' }],
  ])('rejects executable or raw page field %s', async (field, value) => {
    const artifact = await fixture<JsonObject>('course-artifact.v1.json');
    const invalid = structuredClone(artifact) as { lessons: Array<{ page: { blocks: Array<Record<string, unknown>> } }> };
    invalid.lessons[0]!.page.blocks[0]![field] = value;

    expect(() => validateCourseArtifact(invalid)).toThrow(ContractValidationError);
  });

  it('rejects source references and gaps outside the artifact lineage', async () => {
    const artifact = await fixture<JsonObject>('course-artifact.v1.json');
    const invalidUse = structuredClone(artifact) as { sourceUses: Array<{ sourceId: string }> };
    invalidUse.sourceUses[0]!.sourceId = 'source-not-in-artifact';
    expect(() => validateCourseArtifact(invalidUse)).toThrow(ContractValidationError);

    const invalidGap = structuredClone(artifact) as { sourceGaps: Array<{ lessonId: string }> };
    invalidGap.sourceGaps[0]!.lessonId = 'lesson-not-in-artifact';
    expect(() => validateCourseArtifact(invalidGap)).toThrow(ContractValidationError);
  });

  it('accepts a distinct predecessor for a later revision but rejects self-referential lineage', async () => {
    const artifact = await fixture<JsonObject>('course-artifact.v1.json');
    const revision = structuredClone(artifact) as { revision: number; predecessorArtifactId: string | null; artifactId: string };
    revision.revision = 2;
    revision.predecessorArtifactId = 'course-malay-greetings-r1';
    revision.artifactId = 'course-malay-greetings-r2';
    expect(validateCourseArtifact(revision)).toEqual(revision);

    revision.predecessorArtifactId = revision.artifactId;
    expect(() => validateCourseArtifact(revision)).toThrow(ContractValidationError);
  });

  it('accepts only typed application intents, never an unknown or direct-write learner command', async () => {
    const commands = await fixture<JsonObject[]>('learner-commands.v1.json');
    expect(commands.map(validateLearnerCommand)).toEqual(commands);
    expect(learnerCommandSchema.$id).toContain('learner-command/v1');

    const directWrite = structuredClone(commands[0]!) as JsonObject;
    directWrite.sql = 'DELETE FROM journeys';
    expect(() => validateLearnerCommand(directWrite)).toThrow(ContractValidationError);

    const unknown = structuredClone(commands[0]!) as JsonObject;
    unknown.type = 'deleteJourney';
    expect(() => validateLearnerCommand(unknown)).toThrow(ContractValidationError);
  });

  it('records Teach-skill inspiration as an application mapping, not a runtime dependency', async () => {
    const mapping = await fixture<{ mappingVersion: string; runtimeDependency: boolean; mappings: Array<{ teachConcept: string; openBookRecord: string }> }>('teach-skill-mapping.v1.json');

    expect(mapping).toMatchObject({ mappingVersion: 'teach-skill-mapping/v1', runtimeDependency: false });
    expect(Object.fromEntries(mapping.mappings.map(({ teachConcept, openBookRecord }) => [teachConcept, openBookRecord]))).toMatchObject({
      'MISSION.md / context': 'journey goal / context',
      'RESOURCES.md': 'source candidate / use / gap',
      'learning records / notes': 'learner state / preferences',
      'lesson HTML': 'declarative HtmlPageSpec',
      'shared assets': 'later stable-component catalog input',
    });
  });
});
