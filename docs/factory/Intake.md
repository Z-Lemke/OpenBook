# Intake Document

Status: Accepted

Accepted: 2026-07-22

## Opportunity

Build an agent-driven learning platform that creates effective, adaptive learning experiences for any subject. The initial proving ground is Malay language learning: it should determine a learner's level, personalize a plan to their goals, and adapt pace, difficulty, activities, and review based on measured progress.

## Desired outcome

Learners can start any subject from a welcoming front page, complete an adaptive intake assessment, and receive a dynamic learning path. They can follow either a daily lesson or a longer curriculum; the experience supports the learning activities the subject requires and changes as their demonstrated mastery changes.

The first MVP must supply the reusable platform capabilities rather than a Malay-only implementation. Malay is its first end-to-end validation use case. For that use case, a learner can:

- state their goal and available time;
- take an adaptive placement assessment;
- receive and navigate a personalized learning plan;
- complete learning and practice activities, including spaced-repetition vocabulary review; and
- see progress and have difficulty adjusted from performance and check-ins.

## Why it matters

The product should make sustained learning feel effective and rewarding, especially for the requester's Malay-learning goal. It is also a hands-on project for learning generative UI: deciding which product surfaces should remain stable, be parameterized, or be generated for a learner and lesson.

Longer-term, it should outperform static courseware by grounding plans in appropriate pedagogy and external resources, measuring learning outcomes, and reusing proven learning-path and interface artifacts rather than regenerating every experience from zero.

## Useful context

- The platform should minimize chat-first interaction in favor of purpose-built learning interfaces.
- It needs durable tracking of learners, goals, assessments, skill/mastery signals, lesson and learning-path versions, activity outcomes, review schedules, and UI preferences.
- Agents should generate and revise lesson plans, select or create appropriate lesson activities, source and ground recommendations in real learning resources, and use outcome data to improve future plans.
- Candidate language-learning capabilities include reading, listening, speaking with a virtual teacher, grammar drills, vocabulary practice, spaced repetition, and intensive/deep-dive study modes.
- Learning paths may be one day at a time or span a semester; learners should be able to inspect and choose branches in a learning tree.
- Generated learning paths, activities, and UI patterns should be cacheable, attributable to outcomes, and promotable for reuse with targeted adaptation.
- Pedagogy and effectiveness need explicit evidence: assessment calibration, mastery signals, retention and transfer measures, learner check-ins, and comparison or experimentation methods are likely concerns for Discovery.

## Known constraints

- The first MVP must be subject-agnostic and dynamically compose learning plans and experiences; it must not hard-code a Malay-only product model.
- Malay is the first end-to-end validation use case and source of early product feedback.
- The system must personalize by prior knowledge, goals, pace, and performance.
- Generated teaching must be grounded in reliable resources rather than unverified model output.
- The learning experience must support generative UI while preserving consistent, usable interfaces and persistent learner choices.
- No deployment target, technology stack, content-licensing strategy, budget, or privacy/access model has yet been specified.

## Initial Delivery Team

| ID | Member | Type | Initial responsibility |
| --- | --- | --- | --- |
| H1 | Product owner (requester) | Human | Product intent, learner perspective, and acceptance decisions |
| A1 | AI delivery team | Agent | Discovery, requirements, solution design, and implementation support |

Specialist ownership for pedagogy, language-content quality, UX research, privacy, and operations remains to be confirmed in Discovery.

## Open confirmation

Confirm this framing for Discovery: a general-purpose adaptive learning platform is the MVP, and Malay is the first end-to-end validation use case.
