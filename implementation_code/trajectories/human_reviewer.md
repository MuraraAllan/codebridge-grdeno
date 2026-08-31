# Human Reviewer Trajectory

- Role: approve consequential closure and warning acceptance.
- Starting event: receives `CASE-10` lastring registration while warning evidence is unresolved.
- Tool/validation response: reviews route-filtered evidence and validation rows.
- Retry/correction: asks agents to resolve or document warning-level visual/type impacts.
- Final state: approves final closure only after evidence is complete.
- Human checkpoint: this role is the checkpoint; no autonomous agent can bypass it.
