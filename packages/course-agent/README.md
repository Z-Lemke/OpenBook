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

## Local DeepSeek provider

Set this only in the local server environment:

```sh
export DEEPSEEK_API_KEY='your-local-key'
```

Create and inject the adapter in Node server code:

```ts
const generator = createDeepSeekCourseArtifactGenerator();
const artifact = await createCourseArtifact(input, generator);
```

`DEEPSEEK_API_KEY` must never be committed or exposed through a `NEXT_PUBLIC_`
variable. The adapter calls the official OpenAI-compatible DeepSeek endpoint at
`https://api.deepseek.com` using the fixed `deepseek-v4-flash` model and JSON
mode. It has no tools, browser access, shell access, or agent framework.

### Data boundary and privacy

This is a **no-sensitive-data** provider path. The adapter enforces a minimized
outbound payload: learner goal, available minutes, and the source candidates,
uses, and gaps intentionally selected for the course. It never sends
`learnerState`, including freeform notes, preferences, or learner identifiers.
It cannot determine whether a goal or selected source contains sensitive data,
so callers must not put sensitive personal data in either field.

DeepSeek's policy says personal data may be processed and stored in the
People's Republic of China and advises avoiding sensitive personal data. Do not
enable this adapter for sensitive data, children, or real learner profiles until
the product has an appropriate privacy/consent design. The policy for
downstream applications is a separate responsibility for OpenBook.

The adapter requests JSON-mode, declarative `HtmlPageSpec` output and tells the
model to record source gaps before unsupported instructional claims. It parses
the JSON and the application still validates the returned course after merging
its authoritative learner and source fields. Empty JSON-mode responses raise a
typed retryable error; this adapter does not retry them. Tests use deterministic
injected generators and mocked provider calls, never a real API key or network
request.

`deepseek-v4-flash` is an initial cost/quality hypothesis, not a proven learning
quality claim. Compare it through the future evaluation suite before relying on
it for broader course quality decisions.
