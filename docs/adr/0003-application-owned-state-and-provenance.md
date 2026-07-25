# Application-owned state and provenance

Status: proposed

The application owns learning-state transitions and source/artifact lineage; agents submit generated package proposals through a bounded gateway. This produces explainable adaptations, durable recovery, and auditable grounding while preventing agent output from bypassing validation or becoming trusted state. Generated client-side packages may render in the constrained runtime, but only host-validated protocol messages can request an application action. Direct agent or package mutation was rejected because it makes safe validation, rollback, and learner-visible rationale materially less reliable.

## Consequences

Every plan, experience, generated package, and adaptation records version predecessors and input provenance. Generation adapters must return structured proposals and run metadata rather than write to repositories.
