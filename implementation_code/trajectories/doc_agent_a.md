# DOC_AGENT_A Trajectory

- Role: update documentation-owned artifacts only.
- Starting event: `CASE-04` receives an `InferredOutdated` documentation task from ONTO_CONTROLLER.
- Tool/validation response: documentation sync is visible in observability and validation rows.
- Retry/correction: `CASE-06` rejects attempts to mutate code-owned Partials.
- Final state: documentation updates remain isolated from code mutations.
- Human checkpoint: documentation evidence must match final screenshots before lastring closure.
