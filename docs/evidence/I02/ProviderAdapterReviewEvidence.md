# I02 OpenAI provider-adapter evidence

Target branch: `main`
Work-item issue: https://github.com/Z-Lemke/OpenBook/issues/3

## Definition of Done

- A Node-only OpenAI adapter implements the existing injected
  `CourseArtifactGenerator` seam without adding persistence, renderer, or UI
  scope.
- It requires server-local configuration, returns structured declarative course
  output, and preserves application-owned learner/source evidence and contract
  validation.
- Tests cover missing configuration, a valid provider result, replacement of
  model-supplied authority fields, prompt constraints, and invalid output with
  mocked provider modules only.
- Local setup and data/secret boundaries are documented.

## Sources

- [I02 Work Execution Plan](../../factory/WorkExecutionPlan.md)
- [accepted Solution](../../factory/Solution.md)
- [accepted Requirements](../../factory/Requirements.md)

## TDD evidence

The public seam was accepted: `createCourseArtifact(input, generator)` and
`CourseArtifactGenerator` in `packages/course-agent/src/index.ts`.

Red evidence, before the adapter existed:

```text
npm run test --workspace @openbook/course-agent -- openai-course-artifact-generator.test.ts
3 failed: createOpenAICourseArtifactGenerator is not a function
```

The failure was specific to the absent provider factory, not an environment or
unrelated regression.

Green evidence after implementation:

```text
npm run test --workspace @openbook/course-agent  # 8 tests passed
npm run typecheck                                # passed
npm test                                         # web 3, contracts 7, course-agent 8 passed
git diff --check                                 # passed
```

## Independent review

One Factory Reviewer pass found no actionable findings or blockers. It verified
the Node-only boundary, eager missing-key error, mock-only tests, structured
output through the final validation boundary, declarative/source-gap prompt
constraints, and documented privacy/operational scope.

Non-blocking follow-up: when I13 local-operation documentation arrives, state
Node 22 explicitly as a prerequisite because the selected AI SDK provider
requires it and CI already uses Node 22.

## Remaining risks

- A live local run requires a user-supplied `OPENAI_API_KEY`; it was not used or
  validated against the network here.
- `generateObject` is the smallest structured-output API for this adapter but is
  marked deprecated by the currently installed AI SDK in favor of newer API
  shapes; revisit only when updating the provider SDK.
- This increment does not persist provider/model provenance or responses. That
  is intentionally deferred to the local record layer.
