# Application-owned state and provenance

Status: proposed

The application owns learning-state transitions and source/artifact lineage; agents submit Course Artifacts, source candidates, qualification inputs, and later generated-package proposals through bounded gateways. Source discovery, qualification, ranking, selection, and reuse are algorithmic and auditable; no H1-curated trusted corpus or ordinary H1 source-approval gate exists. This produces explainable adaptations, durable recovery, and auditable grounding while preventing agent output from bypassing validation or becoming trusted state. Generated client-side packages may render in the constrained runtime, but only host-validated protocol messages can request an application action. Direct agent or package mutation was rejected because it makes safe validation, rollback, and learner-visible rationale materially less reliable.

## Consequences

Every plan, Course Artifact, source selection, experience, generated package, and adaptation records version predecessors and input provenance. Generation and discovery adapters return structured proposals and run metadata rather than write to repositories. Human Productization Decisions remain limited to promotion into a Supported Module and never gate ordinary source use.
