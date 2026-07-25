# Local application process and SQLite record

Status: proposed

V1 runs a browser client, application API, job runner, and SQLite-backed learning record in one loopback-local process because the accepted scope is local and single-user while durable jobs, recovery, provenance, and generated-module telemetry need one authoritative write owner. Browser-only storage would weaken those guarantees; managed hosting would violate V1. Repository, job, identity, and HTTP ports preserve a later migration to authenticated hosted services and a server database.

## Considered Options

- Browser-only application with IndexedDB
- Streamlit application
- Managed Vercel-style serverless application

## Consequences

The product must document local installation, backup, export, and restore. Deployment, multi-user identity, and hosted operational controls remain a later migration decision rather than implied V1 scope.
