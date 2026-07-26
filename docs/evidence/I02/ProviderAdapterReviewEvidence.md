# I02 DeepSeek provider-adapter evidence

Target branch: `main`
Work-item issue: https://github.com/Z-Lemke/OpenBook/issues/3

## Definition of Done

- A Node-only direct official OpenAI SDK adapter targets DeepSeek's
  OpenAI-compatible endpoint through the existing injected
  `CourseArtifactGenerator` seam without adding persistence, renderer, or UI
  scope.
- It requires server-local `DEEPSEEK_API_KEY`, uses fixed
  `deepseek-v4-flash` JSON mode, shapes a no-sensitive-data payload that omits
  learner state, and preserves application-owned learner/source validation.
- Tests cover missing configuration, exact endpoint/model/JSON-mode request,
  minimized request shaping, empty content, and invalid output with mocked SDK
  calls only.
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
6 failed: createDeepSeekCourseArtifactGenerator is not a function
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

The earlier OpenAI/AI SDK review is superseded by this direct DeepSeek adapter
revision. The DeepSeek reviewer found two issues: JSON mode alone did not give
the model a complete valid Course Artifact target, and the privacy test did not
prove the exact request shape. The adapter now embeds the versioned artifact
schema in its JSON instruction; the test parses and exactly compares the
outbound payload, proving that `learnerState` is excluded. Affected checks were
rerun after those fixes; no second reviewer pass is invoked.

Non-blocking follow-up: when I13 local-operation documentation arrives, state
Node 22 explicitly as a prerequisite because the selected AI SDK provider
requires it and CI already uses Node 22.

## Remaining risks

- A live local run requires a user-supplied `DEEPSEEK_API_KEY`; it was not used
  or validated against the network here.
- DeepSeek documentation notes that JSON mode can return empty content. This
  adapter reports that as a typed retryable failure and performs no retry.
- DeepSeek's policy states personal data can be processed and stored in the PRC
  and advises avoiding sensitive data. The adapter omits learner state by
  construction, but callers remain responsible for never placing sensitive data
  in goals or intentionally selected source evidence.
- `deepseek-v4-flash` is an initial cost/quality hypothesis pending a future
  evaluation suite; no learning-quality benchmark claim is made here.
- This increment does not persist provider/model provenance or responses. That
  is intentionally deferred to the local record layer.
