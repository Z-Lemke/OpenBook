# Immediate generated module runtime and productization boundary

Status: proposed

The platform separates reviewed Supported Modules, untrusted Generated Module Packages, and human Productization Decisions. Only after normal Course Artifact rendering and stable catalog components demonstrably cannot meet a documented activity need may an agent generate a package that renders immediately in an opaque-origin `sandbox="allow-scripts"` iframe with deny-by-default CSP. The package receives no ambient host, server, tool, secret, network, storage, or product-data authority; it can only request its declared, host-validated UI capabilities over a versioned message channel. Package code, input/run/source provenance, validation, usage, outcomes, learner feedback, revocation, and disposition are retained durably. A package never becomes catalog behavior automatically.

## Considered Options

- Declarative candidates only
- Generated code executed in the trusted learner shell
- Generated UI code in a constrained client-side sandbox
- Automatic promotion based on outcomes

## Consequences

The registry needs separate storage/statuses, immutable hashes, validator reports, usage/outcome telemetry, audit records, rapid disablement/revocation, and a productization inbox. A reviewed implementation—not generated package data—creates a Supported Module release. Dynamic server/tool execution still requires separately accepted governance; constrained client-side rendering is intentionally authorized by this decision.
