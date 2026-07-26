# I01 review evidence

Item: `I01` — Course Artifact contract and fixtures
Target branch: `main`
Reviewer pass: 1 (independent Factory Reviewer Agent)

## Pre-review green evidence

Before review, the candidate passed:

```text
PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_*.py' -v
Result: 9 tests passed

python3 -m json.tool schemas/course-artifact/v1.schema.json >/dev/null
Result: passed

git diff --check
Result: passed
```

## Findings and dispositions

1. **P1 — source provenance omitted permitted-use and retrieval context.**
   Resolved: `SourceCandidate` now requires non-blank `permittedUse` and
   `retrievalContext`; the versioned schema, fixture, and rejection test cover both.
2. **P1 — the published JSON Schema diverged from the application validator.**
   Resolved: the schema now encodes revision/predecessor and page-kind constraints where
   JSON Schema can express them; real Draft 2020-12 validation runs in the tests. Its
   `$comment` explicitly directs cross-record constraints to the public lineage validator,
   where the fixture and contiguous-order test cover them.
3. **P1 — commands lacked learner attribution.**
   Resolved: both command variants now require a non-blank `learnerId`, including a
   focused rejection test.

## Post-review green evidence

```text
PYTHONPATH=src uv run --with-requirements requirements-dev.txt python -m unittest discover -s tests -p 'test_*.py' -v
Result: 13 tests passed

python3 -m json.tool schemas/course-artifact/v1.schema.json >/dev/null
Result: passed

git diff --check
Result: passed
```

## Remaining risks

This PR validates submitted artifact and command data in memory only. Durable append-only
storage, agent proposal generation, deterministic rendering, and command execution remain
intentionally deferred to I02–I05. The fixture source URL is illustrative and must not be
treated as a discovered or trusted production source.
