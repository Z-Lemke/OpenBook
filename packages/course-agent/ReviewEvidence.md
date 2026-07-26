# I02 review evidence

## Definition of Done

- A framework-independent Node-side course-agent use case turns validated intake
  and discovered source evidence into a validated `CourseArtifact`.
- Intake and source candidates, uses, and gaps are application-owned inputs;
  the generator is injectable and has no model credentials, persistence, Next, or
  renderer authority.
- A lesson with instructional blocks has a source use or an explicit source gap.
- The Matt Pocock Teach/Learn mapping seam is documented and tested.

## Controlled TDD evidence

The independent Test Specialist proposed the public `createCourseArtifact` seam.
Red evidence was captured before implementation: `test -e
packages/course-agent/src/index.ts` exited 1 because the public module was absent.

Green evidence after implementation:

```text
npm run test --workspace @openbook/course-agent       # 5 tests passed
npm run typecheck --workspace @openbook/course-agent  # passed
npm run test --workspace @openbook/contracts          # 7 tests passed
npm run typecheck --workspace @openbook/contracts     # passed
git diff --check                                      # passed
```

## One-pass reviewer disposition

The independent Factory Reviewer found one P1: root CI only exercised the
contracts workspace. This PR updates CI to install declared workspaces without
writing the root lockfile (an explicit I02 boundary) and runs both contracts and
course-agent typecheck/test commands explicitly. The checks above were rerun
after that change.

Remaining risk: v1 source evidence is attached to a lesson, not individual
instructional claims. The agent can mechanically require lesson-level source
use or gap evidence, but claim-level coverage requires a future contract
evolution.
