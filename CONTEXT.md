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

**Approved Source**: A reliable, permitted resource that the product owner has allowed the product to retrieve and cite.  
_Avoid_: web result, model knowledge

**Source Snapshot**: The identified retrieved form of an Approved Source used to ground a decision or artifact.  
_Avoid_: citation

**Artifact Lineage**: The immutable links from an output to its inputs, generator run, source snapshots, and predecessor versions.  
_Avoid_: metadata, history
