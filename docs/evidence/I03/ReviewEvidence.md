# I03 review evidence

## Contextual Definition of Done

I03 adds the local Next.js Node-runtime learner shell. It deterministically renders
accessible course and lesson pages from the validated `@openbook/contracts` fixture,
uses only renderer-owned layout and style rules, and emits validated learner-command
intents. Generated artifact data remains declarative: no generated HTML, attributes,
scripts, or event handlers are interpreted. Course planning, persistence, SRS, model
providers, and generated executable modules remain out of scope.

Accepted sources: [Solution](../../factory/Solution.md),
[Work Execution Plan](../../factory/WorkExecutionPlan.md) item I03, and
[ADR 0004](../../adr/0004-course-artifact-renderer-evolutionary-seam.md).

## Controlled TDD evidence

- **Test proposal:** A Factory Test Specialist proposed the public
  `CourseArtifactPage` seam and fixture-driven React tests for deterministic accessible
  rendering, escaped declarative text, and a valid completion intent.
- **Red:** After the standard web test dependencies were installed,
  `npm run test --workspace @openbook/web` failed because
  `apps/web/src/course-artifact-page.tsx` did not exist. The test harness and contract
  fixture otherwise loaded, making this a credible missing-renderer red state.
- **Implementation proposal:** A separate Factory Implementation Specialist proposed a
  trusted React-only renderer: discriminated blocks become fixed elements, links are
  local and URL-encoded, and `recordWork` is schema-validated before being emitted.
- **Initial green:** the focused renderer test passed, followed by root typecheck,
  workspace tests, and a production Next build.

## One reviewer pass and dispositions

The Factory Reviewer ran one read-only pass after the initial green candidate.

| Finding | Disposition | Post-review evidence |
| --- | --- | --- |
| P1: The course page did not offer ordinary navigation to its lessons. | Fixed: course pages render a trusted semantic `Course lessons` navigation list from `artifact.lessons`; the renderer test asserts the fixture lesson route. | Focused test, root typecheck, all workspace tests, and production build passed. |
| P2: No trusted layout/style rules were applied. | Fixed: static global renderer-owned CSS and stable page-kind classes provide layout, prompt, and control styling; the test asserts the stable course-page class. | Focused test, root typecheck, all workspace tests, and production build passed. |

## Current checks and remaining risks

- `npm run test --workspace @openbook/web` — passed (3/3).
- `npm run typecheck` — passed.
- `npm test` — passed (web 3/3; contracts 7/7).
- `npm run build --workspace @openbook/web` — passed with Next.js 16.2.12.
- `git diff --check` — passed.

`npm audit --omit=dev` still reports three high-severity transitive findings through
Next's bundled PostCSS and Sharp ranges. The current stable Next 16.2.12 release remains
inside the registry advisory's affected range; npm proposes an unrelated downgrade rather
than a viable fix. The runtime is local-only and this item does not process generated CSS,
but the advisory remains a known dependency risk for a future dependency-maintenance item.

The normal local course and lesson pages use a deterministic fixture until I02 supplies
course planning and I04 supplies the application-owned durable command handler. The current
interactive wrapper intentionally discards emitted intents rather than writing state.
