# I01 review evidence

## Contextual Definition of Done

I01 establishes the framework-independent TypeScript Course Artifact and learner-command
contract that unblocks the course agent, renderer, local record adapter, and harness. It provides
versioned JSON Schemas, types, a public non-writing validator, declarative `HtmlPageSpec`,
source candidate/use/gap and lineage fixtures, Vitest, and pull-request typecheck/test CI. The
reserved web workspace has no routes or rendering.

Accepted sources: Requirements `5025206`, Solution `c92582d`, Work Execution Plan `7075064`.

## Controlled TDD evidence

- **Test proposal:** A Factory Test Specialist supplied
  `packages/contracts/test/course-artifact.contract.test.ts` and the fixture contract.
- **Red:** With the test present and the public `src/index.ts` deliberately empty,
  `npm run test --workspace @openbook/contracts` ran Vitest 3.2.7 and failed two tests because
  `validateCourseArtifact` and `validateLearnerCommand` were missing. This was the intended
  missing-public-validator behavior, not a harness or environment failure.
- **Implementation proposal:** A separate Factory Implementation Specialist proposed AJV 2020-12
  validation, URI-format support, non-mutating schema validation, and only local cross-record
  integrity checks. Learner command authorization and persistence remain out of scope.
- **Initial green:** `npm ci && npm run typecheck && npm test && git diff --check` passed with
  6/6 Vitest tests. A production dependency audit then reported 0 vulnerabilities.

## One reviewer pass and dispositions

The Factory Reviewer ran one read-only pass after the initial green result.

| Finding | Disposition | Post-review evidence |
| --- | --- | --- |
| P1: Later revisions could name themselves as their predecessor. | Fixed: validator rejects `predecessorArtifactId === artifactId`; test accepts a distinct revision-2 predecessor and rejects self-reference. | `npm run typecheck` passed; Vitest 7/7 passed. |
| P2: The direct-write test also used an unknown command type. | Fixed: a valid `recordWork` command with an extra `sql` field is rejected independently; unknown command rejection remains separately asserted. | `npm run typecheck` passed; Vitest 7/7 passed. |

## Current checks and remaining risks

- `npm run typecheck` — passed.
- `npm test` — passed (7/7).
- `git diff --check` — passed.
- The post-review source-only rerun did not change dependencies. A repeat audit outside the
  elevated network context could not reach the npm registry; the successful pre-review production
  audit reported zero vulnerabilities.

Remaining risks are deliberately deferred: I01 does not generate a course, render pages, persist
or authorize commands, retrieve sources, or run an end-to-end journey. The I02–I05 work items own
those behaviors.
