import { validateCourseArtifact, type CourseArtifact } from '@openbook/contracts';

import courseArtifactFixture from '../../../packages/contracts/test/fixtures/course-artifact.v1.json';

/** A deterministic development fixture until I02 supplies persisted artifacts. */
export const demoArtifact: CourseArtifact = validateCourseArtifact(courseArtifactFixture);
