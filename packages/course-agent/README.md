# `@openbook/course-agent`

This framework-independent, Node-side use case accepts validated learner intake and
agent-discovered source evidence, then returns a validated declarative
`CourseArtifact`. It owns no model credentials, persistence, Next.js adapter, or
HTML rendering. A deterministic fixture generator is the intended test double;
a future model provider remains an injected adapter.

The package preserves the early Teach/Learn compatibility seam without taking a
runtime dependency on Matt Pocock's skill or its workspace files:

| Teach/Learn concept | OpenBook boundary |
| --- | --- |
| `MISSION.md` / context | Journey goal / context |
| `RESOURCES.md` | Source candidate / use / gap |
| Learning records / notes | Learner state / preferences |
| Lesson HTML | Declarative `HtmlPageSpec` |
| Shared assets | Later stable-component catalog input |

The application injects intake and discovery evidence into the candidate artifact
before validating it. Each instructional lesson must retain either a source use
or an explicit source gap; the latter makes absent evidence visible rather than
allowing an unsupported claim to appear grounded.
