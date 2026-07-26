'use client';

import { type CourseArtifact, type HtmlPageSpec } from '@openbook/contracts';

import { CourseArtifactPage } from './course-artifact-page';

export function InteractiveCourseArtifactPage({
  artifact,
  page,
  learnerId,
}: {
  artifact: CourseArtifact;
  page: HtmlPageSpec;
  learnerId: string;
}) {
  // I04 adds the application-owned durable command handler. The renderer only
  // emits a validated command here; it cannot persist or otherwise mutate state.
  return <CourseArtifactPage artifact={artifact} page={page} learnerId={learnerId} onLearnerCommand={() => undefined} />;
}
