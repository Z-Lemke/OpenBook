# I01 PR readiness

- Work Item: [I01](https://github.com/Z-Lemke/OpenBook/issues/2)
- Target branch: `main`
- Completion state: `review-ready-not-complete`
- Scope: TypeScript contract package, fixtures, baseline workspace/test tooling, and PR CI only.
- Checks: `npm run typecheck`, `npm test`, and `git diff --check` pass.
- Human QA: run `npm ci && npm run typecheck && npm test`; inspect the Malay fixture and confirm
  that adding a script/raw block attribute, a bad source/lesson reference, a self-predecessor, or
  a direct-write command field fails the contract test.
