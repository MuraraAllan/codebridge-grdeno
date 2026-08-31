# ONTO_CONTROLLER Trajectory

- Role: sole author of graph payloads and ontology lifecycle evidence.
- Starting event: translates agent telemetry into append-only StateTransition and Execution rows.
- Tool/validation response: runs SHACL fixtures and inference query checks before accepting graph evidence.
- Retry/correction: rejects malformed taxonomy, hierarchy, domain, concurrency, and lastring attempts.
- Final state: prepares `REGISTER_LASTRING` only when required evidence exists.
- Human checkpoint: waits for Human Reviewer approval before moving closure from `WAITING_HF` to `DONE_HF`.
