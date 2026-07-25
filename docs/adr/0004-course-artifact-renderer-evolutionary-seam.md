# Course Artifact to Renderer evolutionary seam

Status: proposed

The first delivery seam is a versioned, immutable Course Artifact rendered deterministically by
the local learner website. A learning agent may initially plan the course and shape its
presentation in one role, but it produces declarative artifact data rather than executable UI
or direct state writes. Learner actions are validated by the application and persist to the
durable learning record.

## Considered options

- Build the complete generated-UI/catalog architecture before first learner use
- Make browser or agent output the persistence and rendering contract directly
- Establish Course Artifact → Renderer first and evolve generated UI only where normal rendering is insufficient

## Consequences

The walking skeleton can prove intake, source-grounded learning, rendering, and persisted
feedback quickly. The artifact schema and lineage must remain compatible as continuity,
adaptation, review, catalog, and generated-package capabilities appear. Separate planning and
UI agent roles are deferred until evidence exposes genuine variation; generated code remains
subject to the independently recorded constrained runtime decision.
