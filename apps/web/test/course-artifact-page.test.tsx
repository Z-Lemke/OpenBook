/* @vitest-environment jsdom */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import {
  type CourseArtifact,
  type LearnerCommand,
  validateCourseArtifact,
  validateLearnerCommand,
} from '@openbook/contracts';
import { CourseArtifactPage } from '../src/course-artifact-page.js';

const fixture = async (): Promise<CourseArtifact> =>
  validateCourseArtifact(
    JSON.parse(
      await readFile(
        resolve(process.cwd(), '../../packages/contracts/test/fixtures/course-artifact.v1.json'),
        'utf8',
      ),
    ),
  );

const learnerId = 'learner-local-luke';

afterEach(cleanup);

describe('CourseArtifactPage', () => {
  it('deterministically renders trusted, accessible course and lesson HTML from the contract fixture', async () => {
    const artifact = await fixture();
    const course = (
      <CourseArtifactPage
        artifact={artifact}
        page={artifact.coursePage}
        learnerId={learnerId}
        onLearnerCommand={() => undefined}
      />
    );
    expect(renderToStaticMarkup(course)).toBe(renderToStaticMarkup(course));

    render(course);
    expect(screen.getByRole('main').getAttribute('class')).toBe('course-artifact-page course-artifact-page--course');
    expect(screen.getByRole('heading', { level: 1, name: 'Malay greetings' })).toBeTruthy();
    expect(screen.getByText('A practical introduction to Malay greetings.')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Course lessons' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Say hello and introduce yourself' }).getAttribute('href')).toBe('/lessons/lesson-greetings-1');

    render(
      <CourseArtifactPage
        artifact={artifact}
        page={artifact.lessons[0]!.page}
        learnerId={learnerId}
        onLearnerCommand={() => undefined}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Say hello and introduce yourself' })).toBeTruthy();
    expect(screen.getByText('Choose the greeting you would use with your family.')).toBeTruthy();
  });

  it('renders declarative text as text rather than executing or accepting raw HTML', async () => {
    const artifact = structuredClone(await fixture());
    artifact.lessons[0]!.page.blocks[0]!.text = '<script>window.openbookPwned = true</script><button>Injected</button>';

    render(
      <CourseArtifactPage
        artifact={artifact}
        page={artifact.lessons[0]!.page}
        learnerId={learnerId}
        onLearnerCommand={() => undefined}
      />,
    );
    expect(screen.getByText('<script>window.openbookPwned = true</script><button>Injected</button>')).toBeTruthy();
    expect(document.querySelector('script')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Injected' })).toBeNull();
  });

  it('translates a lesson-complete interaction into a schema-valid learner intent without writing', async () => {
    const artifact = await fixture();
    const emitted: LearnerCommand[] = [];
    const user = userEvent.setup();

    render(
      <CourseArtifactPage
        artifact={artifact}
        page={artifact.lessons[0]!.page}
        learnerId={learnerId}
        onLearnerCommand={(command) => emitted.push(command)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Mark lesson complete' }));

    expect(emitted).toHaveLength(1);
    expect(validateLearnerCommand(emitted[0])).toMatchObject({
      commandVersion: 'learner-command/v1',
      type: 'recordWork',
      learnerId,
      artifactId: artifact.artifactId,
      lessonId: artifact.lessons[0]!.lessonId,
      outcome: 'completed',
    });
  });
});
