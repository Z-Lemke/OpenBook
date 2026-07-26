import {
  validateCourseArtifact,
  type CourseArtifact,
  type SourceCandidate,
  type SourceGap,
  type SourceUse,
} from '@openbook/contracts';

export interface CourseIntake {
  goal: string;
  availableMinutesPerDay: number;
}

export interface SourceDiscovery {
  candidates: unknown[];
  uses: unknown[];
  gaps: unknown[];
}

export interface LearnerState {
  learnerId: string;
  priorNotes?: string;
  preferences?: Record<string, string>;
}

export interface CreateCourseArtifactInput {
  intake: CourseIntake;
  sourceDiscovery: SourceDiscovery;
  learnerState?: LearnerState;
}

/**
 * A model adapter belongs outside this package. It can be a deterministic fixture
 * in tests or a future provider adapter, but its output never bypasses contracts.
 */
export type CourseArtifactGenerator = (input: CreateCourseArtifactInput) => unknown | Promise<unknown>;

export const teachSkillMappings = {
  runtimeDependency: false,
  mappings: [
    { teachConcept: 'MISSION.md / context', openBookRecord: 'journey goal / context' },
    { teachConcept: 'RESOURCES.md', openBookRecord: 'source candidate / use / gap' },
    { teachConcept: 'learning records / notes', openBookRecord: 'learner state / preferences' },
    { teachConcept: 'lesson HTML', openBookRecord: 'declarative HtmlPageSpec' },
    { teachConcept: 'shared assets', openBookRecord: 'later stable-component catalog input' },
  ],
} as const;

function assertValidIntake(intake: CourseIntake): void {
  if (intake.goal.trim().length === 0) {
    throw new Error('Course intake goal must be non-empty');
  }
  if (!Number.isInteger(intake.availableMinutesPerDay) || intake.availableMinutesPerDay <= 0) {
    throw new Error('Course intake available minutes must be a positive integer');
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new Error('Course generator must return an artifact object');
  }
  return value as Record<string, unknown>;
}

function assertLessonEvidence(artifact: CourseArtifact): void {
  for (const lesson of artifact.lessons) {
    if (lesson.page.blocks.length === 0) {
      continue;
    }
    const hasSourceUse = artifact.sourceUses.some((sourceUse) => sourceUse.lessonId === lesson.lessonId);
    const hasSourceGap = artifact.sourceGaps.some((sourceGap) => sourceGap.lessonId === lesson.lessonId);
    if (!hasSourceUse && !hasSourceGap) {
      throw new Error(`Lesson ${lesson.lessonId} has instructional content without a source use or source gap`);
    }
  }
}

/**
 * Creates a validated, declarative course revision. The application owns intake
 * and discovered-source fields, so a generator cannot silently omit or replace
 * the evidence that grounded its proposed course.
 */
export async function createCourseArtifact(
  input: CreateCourseArtifactInput,
  generator: CourseArtifactGenerator,
): Promise<CourseArtifact> {
  assertValidIntake(input.intake);
  const generated = asRecord(await generator(input));
  const candidate = {
    ...generated,
    learner: {
      goal: input.intake.goal,
      availableMinutesPerDay: input.intake.availableMinutesPerDay,
    },
    sourceCandidates: input.sourceDiscovery.candidates as SourceCandidate[],
    sourceUses: input.sourceDiscovery.uses as SourceUse[],
    sourceGaps: input.sourceDiscovery.gaps as SourceGap[],
  };
  const artifact = validateCourseArtifact(candidate);
  assertLessonEvidence(artifact);
  return artifact;
}
