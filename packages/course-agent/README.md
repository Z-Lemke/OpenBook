# `@openbook/course-agent`

This framework-independent, Node-side use case accepts validated learner intake
and agent-discovered source evidence, then returns a validated declarative
`CourseArtifact`. It owns no persistence, Next.js adapter, or HTML rendering.
The model remains an injected generator; a deterministic fixture generator is
the intended test double.

The package preserves the early Teach/Learn compatibility seam without taking a
runtime dependency on Matt Pocock's skill or its workspace files:

| Teach/Learn concept | OpenBook boundary |
| --- | --- |
| `MISSION.md` / context | Journey goal / context |
| `RESOURCES.md` | Source candidate / use / gap |
| Learning records / notes | Learner state / preferences |
| Lesson HTML | Declarative `HtmlPageSpec` |
| Shared assets | Later stable-component catalog input |

The application injects intake and discovery evidence into the candidate
artifact before validating it. Each instructional lesson must retain either a
source use or an explicit source gap; the latter makes absent evidence visible
rather than allowing an unsupported claim to appear grounded.

## Local OpenAI provider

Set this only in the local server environment:

```sh
export OPENAI_API_KEY='your-local-key'
# Optional; defaults to gpt-4.1-mini.
export OPENAI_MODEL='gpt-4.1-mini'
```

Create and inject the adapter in Node server code:

```ts
const generator = createOpenAICourseArtifactGenerator();
const artifact = await createCourseArtifact(input, generator);
```

`OPENAI_API_KEY` must never be committed or exposed through a `NEXT_PUBLIC_`
variable. This adapter sends only the intake, learner state, and discovered
source evidence supplied to it to the configured OpenAI model. It does not
persist a prompt, key, model response, learner record, or source data; durable
records and provenance are future application-layer responsibilities.

The adapter requests structured, declarative `HtmlPageSpec` output and tells
the model to record source gaps before unsupported instructional claims. The
application still validates the returned course after it merges its authoritative
learner and source fields. Tests use deterministic injected generators and
mocked provider calls, never a real API key or network request.
