import { notFound } from 'next/navigation';

import { demoArtifact } from '../../../src/demo-artifact';
import { InteractiveCourseArtifactPage } from '../../../src/interactive-course-artifact-page';

const localLearnerId = 'local-demo-learner';

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = demoArtifact.lessons.find((candidate) => candidate.lessonId === lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <InteractiveCourseArtifactPage
      artifact={demoArtifact}
      page={lesson.page}
      learnerId={localLearnerId}
    />
  );
}
