'use client';

import * as React from 'react';
import { type CourseArtifact, type HtmlBlock, type HtmlPageSpec, type LearnerCommand, validateLearnerCommand } from '@openbook/contracts';

export interface CourseArtifactPageProps {
  artifact: CourseArtifact;
  page: HtmlPageSpec;
  learnerId: string;
  onLearnerCommand: (command: LearnerCommand) => void;
}

function Block({ block, lessonIds }: { block: HtmlBlock; lessonIds: ReadonlySet<string> }) {
  switch (block.type) {
    case 'text':
      return <p>{block.text}</p>;
    case 'prompt':
      return <aside aria-label="Practice prompt">{block.text}</aside>;
    case 'lesson-link':
      return lessonIds.has(block.lessonId) ? (
        <p>
          <a href={`/lessons/${encodeURIComponent(block.lessonId)}`}>{block.text}</a>
        </p>
      ) : (
        <p>{block.text}</p>
      );
  }
}

/**
 * Trusted renderer for declarative Course Artifact pages. It is intentionally
 * unable to interpret generated markup, attributes, scripts, or event handlers.
 */
export function CourseArtifactPage({ artifact, page, learnerId, onLearnerCommand }: CourseArtifactPageProps) {
  const lessonIds = new Set(artifact.lessons.map(({ lessonId }) => lessonId));
  const lesson = artifact.lessons.find(({ page: lessonPage }) => lessonPage.pageId === page.pageId);

  const markLessonComplete = () => {
    if (!lesson) {
      return;
    }

    const command = validateLearnerCommand({
      commandVersion: 'learner-command/v1',
      commandId: `record-work:${artifact.artifactId}:${lesson.lessonId}`,
      learnerId,
      type: 'recordWork',
      artifactId: artifact.artifactId,
      lessonId: lesson.lessonId,
      outcome: 'completed',
    });
    onLearnerCommand(command);
  };

  return (
    <main className={`course-artifact-page course-artifact-page--${page.kind}`}>
      <h1>{page.title}</h1>
      {page.blocks.map((block) => (
        <Block key={block.blockId} block={block} lessonIds={lessonIds} />
      ))}
      {page.kind === 'course' ? (
        <nav aria-label="Course lessons">
          <h2>Lessons</h2>
          <ol>
            {artifact.lessons.map((courseLesson) => (
              <li key={courseLesson.lessonId}>
                <a href={`/lessons/${encodeURIComponent(courseLesson.lessonId)}`}>{courseLesson.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      {page.kind === 'lesson' && lesson ? (
        <button type="button" onClick={markLessonComplete}>
          Mark lesson complete
        </button>
      ) : null}
    </main>
  );
}
