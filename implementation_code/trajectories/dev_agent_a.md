# DEV_AGENT_A Trajectory

- Role: implement code-owned changes only.
- Starting event: `CASE-01` moves `ex:part_shacl_validator` from `Draft` to `Review`.
- Tool/validation response: `HierarchyShieldShape` confirms the Partial event does not mutate the parent Feature.
- Retry/correction: direct `Draft` to `Released` in `CASE-02` is rejected and rerouted through review.
- Final state: code-owned work can proceed when SHACL and type validation are clean.
- Human checkpoint: warning-level code evidence in `CASE-08` must be resolved or accepted before lastring.
