# Adaptive Learning Platform

The adaptive-learning context owns a single learner’s evidence-backed journey and the governed evolution of reusable learner-interface capabilities. It distinguishes stable platform behavior from agent-produced, constrained runtime artifacts.

## Learning journey

**Journey**: A learner's continuing pursuit of one subject goal, including its plan, work, evidence, and adaptations.  
_Avoid_: course, session

**Plan Revision**: An immutable version of the learner-facing sequence and pacing proposed for a Journey.  
_Avoid_: syllabus, schedule

**Capability Evidence**: An observable result or learner check-in that supports a revisable statement about what a learner can do or recall.  
_Avoid_: mastery score, progress point

**Adaptation Decision**: An explainable change to a Journey's plan, difficulty, pacing, review, or teaching approach that cites Capability Evidence.  
_Avoid_: personalization, recommendation

**Review Item**: A retained fact, vocabulary item, or configured retention target with a history and next-review state.  
_Avoid_: flashcard

## Experience capabilities

**Supported Module**: A reviewed, versioned learner-interface capability with a declared contract that the platform is allowed to select and render.  
_Avoid_: component, template, plugin

**Experience Specification**: A declarative, versioned arrangement of Supported Modules and Generated Module Package references for a particular Plan Revision.  
_Avoid_: generated UI, page

**Generated Module Package**: An immutable, agent-produced UI source bundle that may render immediately only in the constrained generated-module runtime; it is not a Supported Module and has no ambient product privileges.  
_Avoid_: trusted plugin, arbitrary script

**Package Capability Manifest**: The versioned, finite list of host-validated UI actions a Generated Module Package may request for one activity.  
_Avoid_: permissions, tool access

**Productization Decision**: A human-recorded disposition of generated-package evidence that may lead to a separately reviewed Supported Module release.  
_Avoid_: promotion, auto-approval

## Grounding and accountability

**Source Record**: A durable candidate or retrieved source form with its available provenance, permitted-use signals, coverage, qualification/ranking evidence, selection/reuse history, and outcome links.
_Avoid_: approved source, trusted corpus

**Source Gap**: A recorded material instructional need for which the available discovered evidence does not adequately support a claim or activity.
_Avoid_: model fill-in, missing citation

**Course Artifact**: An immutable, versioned, declarative description of a course or journey revision that a local renderer can deterministically present.
_Avoid_: executable lesson, page code

**Renderer**: The trusted local application boundary that converts a Course Artifact and bounded learner state into learner UI and validated learner commands.
_Avoid_: agent UI, generated code

**Artifact Lineage**: The immutable links from an output to its inputs, generator run, source records, and predecessor versions.
_Avoid_: metadata, history
