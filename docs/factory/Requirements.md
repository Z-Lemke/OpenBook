# Requirements Document

Status: Accepted

Accepted: 2026-07-22

Based on: [accepted Intake Document](Intake.md) (accepted at `d2f94e054749c919fe94f0cd5e0663afaeeca391`) and [accepted Discovery Document](Discovery.md) (accepted at `50b86de2c174af4e0ace7866b42e96e9d72535bb`)

## Product outcome

V1 is a local, single-user, generic adaptive-learning product. For any viable subject, it can guide a learner from a stated goal through teaching and practice to evidence-based adaptation. Malay is the product owner's primary and most intensive end-to-end validation use case, not the product model or V1's only capability.

## Functional outcomes

1. A learner can start or resume a subject journey, state a goal and available time, complete adaptive intake or leveling, and review, give feedback on, and adjust a learner-facing syllabus or learning plan with daily-lesson and read-ahead views.
2. The product dynamically provides subject-appropriate lessons and practice through consistent, purpose-built learner interfaces rather than chat-first interaction. It may tailor teaching, activities, and UI to the subject and learner using generic supported capabilities; task-specific approaches remain within the stated governance boundary.
3. A learner receives level-appropriate teaching, practice, feedback, and trustworthy recommended resources, paced and made more or less challenging in response to demonstrated capability and learner feedback.
4. Intake, lesson work, checkpoints, retention or transfer evidence where relevant, and learner check-ins update durable capability evidence. That evidence changes the plan, pacing, difficulty, review work, or subsequent teaching style without excessive testing.
5. Learners can inspect durable progress, capability evidence, feedback, and plan changes; after a lapse, they can resume with an adjusted plan.
6. The product persistently schedules and presents spaced-repetition review for learned facts or vocabulary across relevant subjects and learning contexts; review outcomes inform later work.
7. Learner records durably retain goals, availability, assessment and capability evidence, plan and lesson versions, activity and review outcomes, preferences, feedback, source provenance, and artifact lineage needed to resume, evaluate, and adapt a journey.
8. Agents may generate or revise plans, teaching, activities, and learner UI with identified source grounding. Reusable lesson, activity, learning-path, and UI artifacts may be retained as versioned, attributable candidates; outcome evidence and learner feedback may identify candidates, but no candidate automatically becomes trusted platform behavior.

## Quality and acceptance evidence

| Area | Required evidence |
| --- | --- |
| Complete adaptive journey | For Malay and at least one additional viable subject, demonstrate goal/intake, learner review and feedback on a syllabus or learning plan, subject-appropriate lesson/practice UI, progress or capability evidence, and an evidence-driven adaptation. The additional subject is a validation example, not a product boundary; several diverse examples may be tried. |
| Malay intensive validation | Demonstrate Malay placement, a personalized plan, language learning/practice, persistent spaced-repetition vocabulary review, capability evidence, and performance/check-in-based adaptation against the product owner's stated goal. Completion alone is not success. |
| Generic capability | The cross-subject demonstrations use the generic product capabilities, not a Malay-only or language-only product model. Subject-specific teaching and UI may differ where appropriate while preserving understandable interaction patterns and learner choices. |
| Learning effectiveness | Evidence shows appropriate instructional work and either capability change or a clearly evidenced remaining gap. Assessments are proportionate and explain a plan, difficulty, review, pacing, or teaching change. |
| Grounding and provenance | Representative plans, lessons, recommendations, and generated/reusable artifacts identify reliable, permitted sources and preserve the associated learner and outcome evidence. |
| Local operation | The product runs for the local product owner, preserves meaningful state across normal use, and documents setup, operation, recovery, known limitations, learner use, provenance/evaluation records, and safety boundaries. |
| Future readiness | V1 preserves credible seams for later deployment and multi-user operation without delivering either mode or requiring a fundamental rearchitecture to add them. |

## Constraints and operational needs

- V1 is local and single-user. Hosted rollout, multi-user operation, external integrations, authentication/roles, external sharing, commercial delivery, production on-call, and service-level objectives are out of scope.
- V1 is subject-agnostic and dynamically composes learning plans and experiences; validation subjects illustrate capability and do not define a fixed product boundary.
- Instructional material is grounded in reliable, permitted resources rather than unverified model output.
- Dynamic executable code or tools discovered or generated by agents must not be blindly persisted or re-executed. Any future persistence, execution, promotion, or reuse requires an explicit trust boundary, provenance, review/approval authority, permissions/isolation, auditability, and revocation/rollback policy.
- H1 owns product intent, priority, and acceptance decisions. A1 proposes and implements only within accepted decisions; pedagogy, subject quality, security, privacy, UX research, and operations remain specialist-wayfinder roles.

## Accepted uncertainty and deferrals

- Validation subjects beyond intensive Malay and the required additional example, exact modalities, source corpus, pedagogical/calibration method, lesson-template promotion criteria, stable-versus-generated UI boundaries, technology stack, and local persistence design are for Solution, provided they meet these outcomes and evidence.
- Deployment, multi-user access, privacy/retention/consent policy, scale, commercial model, integrations, geographic rollout, budget, and concrete production operations are outside V1. Solution must preserve the growth-path guardrail without expanding V1 scope.
- No artifact promotion or dynamic-tool execution is authorized by this document; a later human-owned policy decision is required before either is introduced.

## Human decision requested

Accept these V1 requirements as the basis for independent Validation and Solution planning.
