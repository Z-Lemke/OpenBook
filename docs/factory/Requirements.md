# Requirements Document

Status: Accepted

Accepted: 2026-07-25

Based on: [accepted Intake Document](Intake.md) (accepted at `d2f94e054749c919fe94f0cd5e0663afaeeca391`) and [accepted Discovery Document](Discovery.md) (accepted at `50b86de2c174af4e0ace7866b42e96e9d72535bb`)

This revision supersedes the previously accepted Requirements Document and requires independent validation and renewed human acceptance.

## Product outcome

V1 is a local, single-user, generic adaptive-learning product. For any viable subject, it can guide a learner from a stated goal through teaching and practice to evidence-based adaptation. Malay is the product owner's primary and most intensive end-to-end validation use case, not the product model or V1's only capability.

## Functional outcomes

1. A learner can start or resume a subject journey, state a goal and available time, complete adaptive intake or leveling, and review, give feedback on, and adjust a learner-facing syllabus or learning plan with daily-lesson and read-ahead views.
2. The product dynamically provides subject-appropriate lessons and practice through consistent, purpose-built learner interfaces rather than chat-first interaction. An agent may select stable catalog components, arrange a subject-appropriate page layout, and, when the catalog lacks a good fit, generate a fresh subject-appropriate UI component that renders immediately in the learner experience while conforming to the product's layout and style guides.
3. A learner receives level-appropriate teaching, practice, feedback, and trustworthy recommended resources, paced and made more or less challenging in response to demonstrated capability and learner feedback.
4. Intake, lesson work, checkpoints, retention or transfer evidence where relevant, and learner check-ins update durable capability evidence. That evidence changes the plan, pacing, difficulty, review work, or subsequent teaching style without excessive testing.
5. Learners can inspect durable progress, capability evidence, feedback, and plan changes; after a lapse, they can resume with an adjusted plan.
6. The product persistently schedules and presents spaced-repetition review for learned facts or vocabulary across relevant subjects and learning contexts; review outcomes inform later work.
7. Learner records durably retain goals, availability, assessment and capability evidence, plan and lesson versions, activity and review outcomes, preferences, feedback, source provenance, and artifact lineage needed to resume, evaluate, and adapt a journey.
8. Agents may generate or revise plans, teaching, activities, and learner UI with identified source grounding. Each generated UI component is retained or logged with its component specification, source or code and provenance, generation input and run information, layout/style-validation result, learner usage, outcomes, and learner feedback. This evidence makes repeated useful patterns visible for deliberate first-class productization, but does not automatically make a candidate trusted platform behavior.

## Quality and acceptance evidence

| Area | Required evidence |
| --- | --- |
| Complete adaptive journey | For Malay and at least one additional viable subject, demonstrate goal/intake, learner review and feedback on a syllabus or learning plan, subject-appropriate lesson/practice UI, progress or capability evidence, and an evidence-driven adaptation. The additional subject is a validation example, not a product boundary; several diverse examples may be tried. |
| Malay intensive validation | Demonstrate Malay placement, a personalized plan, language learning/practice, persistent spaced-repetition vocabulary review, capability evidence, and performance/check-in-based adaptation against the product owner's stated goal. Completion alone is not success. |
| Generic capability | The cross-subject demonstrations use the generic product capabilities, not a Malay-only or language-only product model. Subject-specific teaching and UI may differ where appropriate while preserving understandable interaction patterns and learner choices. |
| Learning effectiveness | Evidence shows appropriate instructional work and either capability change or a clearly evidenced remaining gap. Assessments are proportionate and explain a plan, difficulty, review, pacing, or teaching change. |
| Grounding and provenance | Representative plans, lessons, recommendations, and generated/reusable artifacts identify reliable, permitted sources and preserve the associated learner and outcome evidence. |
| Generative UI | In representative subject journeys, show stable-component selection and layout arrangement, plus a case where the stable catalog lacks a good fit and a newly generated subject-appropriate component renders immediately. For each demonstrated generated component, retain the required specification/source-or-code/provenance, generation run/input, layout/style validation, usage, outcome, and learner-feedback record; use the records to surface, rather than automatically promote, repeated useful patterns. |
| Constrained UI trust boundary | Demonstrate that a generated component can render only through approved UI capabilities and has no implicit server, tool, secret, network, or product-data privilege. Attempts to exceed the approved boundary are denied or safely contained and leave auditable evidence. |
| Local operation | The product runs for the local product owner, preserves meaningful state across normal use, and documents setup, operation, recovery, known limitations, learner use, provenance/evaluation records, and safety boundaries. |
| Future readiness | V1 preserves credible seams for later deployment and multi-user operation without delivering either mode or requiring a fundamental rearchitecture to add them. |

## Constraints and operational needs

- V1 is local and single-user. Hosted rollout, multi-user operation, external integrations, authentication/roles, external sharing, commercial delivery, production on-call, and service-level objectives are out of scope.
- V1 is subject-agnostic and dynamically composes learning plans and experiences; validation subjects illustrate capability and do not define a fixed product boundary.
- Instructional material is grounded in reliable, permitted resources rather than unverified model output.
- Generated UI components may render immediately only within an explicit constrained trust boundary. The runtime must enforce approved UI capabilities and must not confer implicit server, tool, secret, network, or product-data privileges. This does not authorize blind persistence or re-execution of arbitrary generated code or tools; generated-component retention/logging, execution, reuse, promotion, auditability, and revocation/rollback must remain governed by the boundary.
- H1 owns product intent, priority, and acceptance decisions. A1 proposes and implements only within accepted decisions; pedagogy, subject quality, security, privacy, UX research, and operations remain specialist-wayfinder roles.

## Accepted uncertainty and deferrals

- Validation subjects beyond intensive Malay and the required additional example, exact modalities, source corpus, pedagogical/calibration method, lesson-template promotion criteria, technology stack, and local persistence design are for Solution, provided they meet these outcomes and evidence.
- Solution must decide the precise generated-component sandbox or renderer, approved UI-capability model, artifact lifecycle, retention/log format, validation mechanism, audit and revocation/rollback controls, and the detailed stable-versus-generated component boundaries. It must preserve immediate learner rendering within the stated constrained trust boundary and must not expand V1 into arbitrary tool execution or implicit privileged access.
- Deployment, multi-user access, privacy/retention/consent policy, scale, commercial model, integrations, geographic rollout, budget, and concrete production operations are outside V1. Solution must preserve the growth-path guardrail without expanding V1 scope.
- No artifact is automatically promoted to trusted platform behavior, and no arbitrary dynamic-tool execution is authorized by this document. A later human-owned policy decision is required for promotion or any capability beyond the approved generated-UI trust boundary.

## Human decision requested

Accept this revised V1 requirements document, including immediate constrained generation and retention/logging of subject-appropriate UI components, as superseding the previously accepted requirements and as the basis for independent Validation and renewed Solution planning.
