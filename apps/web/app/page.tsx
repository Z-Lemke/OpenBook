import { demoArtifact } from '../src/demo-artifact';
import { InteractiveCourseArtifactPage } from '../src/interactive-course-artifact-page';

const localLearnerId = 'local-demo-learner';

export default function CoursePage() {
  return (
    <InteractiveCourseArtifactPage
      artifact={demoArtifact}
      page={demoArtifact.coursePage}
      learnerId={localLearnerId}
    />
  );
}
