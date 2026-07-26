# I03 PR readiness

- Work Item: [I03](https://github.com/Z-Lemke/OpenBook/issues/4)
- Target branch: `main`
- Completion state: `review-ready-not-complete`
- Scope: local Next/React declarative Course Artifact renderer, course/lesson routes,
  trusted style/layout, standard React tests, and workspace checks only.
- Checks: `npm run test --workspace @openbook/web`, `npm run typecheck`, `npm test`,
  `npm run build --workspace @openbook/web`, and `git diff --check` pass.
- Human QA: run `npm run dev --workspace @openbook/web`; verify `/` shows the Malay
  course and a lesson link, verify `/lessons/lesson-greetings-1` shows the lesson and
  completion control, and confirm declarative strings render as text rather than HTML.
- Known risk: see [review evidence](ReviewEvidence.md) for the unresolved transitive
  production dependency advisories.
