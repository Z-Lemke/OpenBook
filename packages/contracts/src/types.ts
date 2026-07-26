export type HtmlBlock =
  | { blockId: string; type: 'text' | 'prompt'; text: string }
  | { blockId: string; type: 'lesson-link'; lessonId: string; text: string };

export interface HtmlPageSpec {
  pageId: string;
  kind: 'course' | 'read-ahead' | 'daily' | 'lesson';
  title: string;
  blocks: HtmlBlock[];
}

export interface Lesson {
  lessonId: string;
  order: number;
  title: string;
  page: HtmlPageSpec & { kind: 'lesson' };
}

export interface SourceCandidate {
  sourceId: string;
  title: string;
  url: string;
  coverage: string;
  provenance: string;
  permittedUse: string;
  retrievalContext: string;
}

export interface SourceUse {
  useId: string;
  sourceId: string;
  lessonId: string;
  role: string;
  coveredClaim: string;
}

export interface SourceGap {
  gapId: string;
  lessonId: string;
  need: string;
}

export interface ArtifactLineage {
  generatorRunId: string;
  inputSummary: string;
}

export interface CourseArtifact {
  schemaVersion: 'course-artifact/v1';
  artifactId: string;
  revision: number;
  predecessorArtifactId: string | null;
  learner: { goal: string; availableMinutesPerDay: number };
  title: string;
  lessons: Lesson[];
  coursePage: HtmlPageSpec & { kind: 'course' };
  readAheadPage: HtmlPageSpec & { kind: 'read-ahead' };
  dailyPage: HtmlPageSpec & { kind: 'daily' };
  sourceCandidates: SourceCandidate[];
  sourceUses: SourceUse[];
  sourceGaps: SourceGap[];
  lineage: ArtifactLineage;
}

interface LearnerCommandBase {
  commandVersion: 'learner-command/v1';
  commandId: string;
  learnerId: string;
}

export type LearnerCommand =
  | (LearnerCommandBase & { type: 'startJourney'; goal: string; availableMinutes: number })
  | (LearnerCommandBase & { type: 'resumeJourney'; journeyId: string })
  | (LearnerCommandBase & { type: 'recordWork'; artifactId: string; lessonId: string; outcome: 'completed' | 'needs-review' })
  | (LearnerCommandBase & { type: 'recordFeedback'; artifactId: string; lessonId: string; rating: 'helpful' | 'not-helpful'; comment?: string });
