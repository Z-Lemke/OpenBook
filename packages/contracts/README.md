# `@openbook/contracts`

This framework-independent package is the public contract between the future course agent,
trusted React renderer, application core, record adapter, and harness. It exports versioned JSON
Schemas, TypeScript types, and validators. `CourseArtifact` and `HtmlPageSpec` are declarative
data only: they cannot contain scripts, arbitrary attributes, or persistence instructions.

`LearnerCommand` is a validated React-to-application intent such as starting/resuming a journey,
recording work, or giving feedback. Validation does not write data or authorize a referenced
artifact; application-owned core and record work handle that in later items.

## Teach-skill compatibility seam

Matt Pocock's Teach/Learn workflow is an inspiration and evaluation reference, not a runtime
dependency or file-backed persistence model. The checked mapping fixture preserves the MVP seam:

| Teach/Learn concept | OpenBook record/boundary |
| --- | --- |
| `MISSION.md` / context | Journey goal / context |
| `RESOURCES.md` | Source candidate / use / gap |
| Learning records / notes | Learner state / preferences |
| Lesson HTML | Declarative `HtmlPageSpec` rendered later by trusted React |
| Shared assets | Later stable-component catalog input |

I02 will use this seam when it implements the combined course agent; I01 intentionally does not
implement that agent, rendering, persistence, or command execution.
