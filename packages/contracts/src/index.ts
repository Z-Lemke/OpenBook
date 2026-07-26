import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

import courseArtifactSchemaJson from '../schemas/course-artifact.v1.schema.json' with { type: 'json' };
import learnerCommandSchemaJson from '../schemas/learner-command.v1.schema.json' with { type: 'json' };

export type {
  ArtifactLineage,
  CourseArtifact,
  HtmlBlock,
  HtmlPageSpec,
  LearnerCommand,
  Lesson,
  SourceCandidate,
  SourceGap,
  SourceUse,
} from './types.js';
import type { CourseArtifact, HtmlPageSpec, LearnerCommand } from './types.js';

export const courseArtifactSchema = courseArtifactSchemaJson;
export const learnerCommandSchema = learnerCommandSchemaJson;

export class ContractValidationError extends Error {
  constructor(public readonly errors: readonly ErrorObject[] | null, message: string) {
    super(message);
    this.name = 'ContractValidationError';
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateArtifactShape = ajv.compile(courseArtifactSchema) as ValidateFunction<CourseArtifact>;
const validateCommandShape = ajv.compile(learnerCommandSchema) as ValidateFunction<LearnerCommand>;

function assertSchema<T>(validator: ValidateFunction<T>, input: unknown, subject: string): asserts input is T {
  if (!validator(input)) {
    throw new ContractValidationError(validator.errors ?? null, `${subject} does not match its versioned schema`);
  }
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new ContractValidationError(null, `${label} must be unique within a Course Artifact`);
  }
}

function assertPageIntegrity(page: HtmlPageSpec): void {
  assertUnique(page.blocks.map(({ blockId }) => blockId), `block IDs on page ${page.pageId}`);
}

function assertArtifactRelationships(artifact: CourseArtifact): void {
  if (artifact.predecessorArtifactId === artifact.artifactId) {
    throw new ContractValidationError(null, 'an artifact cannot name itself as its predecessor');
  }
  const lessonIds = artifact.lessons.map(({ lessonId }) => lessonId);
  assertUnique(lessonIds, 'lesson IDs');
  assertUnique(artifact.lessons.map(({ page }) => page.pageId), 'lesson page IDs');
  assertUnique(artifact.sourceCandidates.map(({ sourceId }) => sourceId), 'source IDs');
  assertUnique(artifact.sourceUses.map(({ useId }) => useId), 'source-use IDs');
  assertUnique(artifact.sourceGaps.map(({ gapId }) => gapId), 'source-gap IDs');
  for (const page of [artifact.coursePage, artifact.readAheadPage, artifact.dailyPage, ...artifact.lessons.map(({ page }) => page)]) {
    assertPageIntegrity(page);
  }

  const orders = artifact.lessons.map(({ order }) => order).sort((left, right) => left - right);
  if (!orders.every((order, index) => order === index + 1)) {
    throw new ContractValidationError(null, 'lesson order must start at 1 and be contiguous');
  }

  const lessonIdSet = new Set(lessonIds);
  const sourceIdSet = new Set(artifact.sourceCandidates.map(({ sourceId }) => sourceId));
  for (const use of artifact.sourceUses) {
    if (!sourceIdSet.has(use.sourceId) || !lessonIdSet.has(use.lessonId)) {
      throw new ContractValidationError(null, `source use ${use.useId} must reference an artifact source and lesson`);
    }
  }
  for (const gap of artifact.sourceGaps) {
    if (!lessonIdSet.has(gap.lessonId)) {
      throw new ContractValidationError(null, `source gap ${gap.gapId} must reference an artifact lesson`);
    }
  }

  const referencedLessons = artifact.dailyPage.blocks
    .filter((block): block is Extract<typeof block, { type: 'lesson-link' }> => block.type === 'lesson-link')
    .map(({ lessonId }) => lessonId);
  if (referencedLessons.some((lessonId) => !lessonIdSet.has(lessonId))) {
    throw new ContractValidationError(null, 'daily page lesson links must reference artifact lessons');
  }
}

/** Validates an immutable declarative course revision; it performs no writes. */
export function validateCourseArtifact(input: unknown): CourseArtifact {
  assertSchema(validateArtifactShape, input, 'Course Artifact');
  assertArtifactRelationships(input);
  return input;
}

/** Validates a learner intent; application core authorizes and persists it later. */
export function validateLearnerCommand(input: unknown): LearnerCommand {
  assertSchema(validateCommandShape, input, 'Learner command');
  return input;
}
