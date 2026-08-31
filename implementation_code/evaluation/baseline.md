# Baseline Boundary

This baseline is the direct-agent/manual-documentation loop used for fair comparison against the ontology-governed workflow.

## Baseline capabilities

- One direct prompt or one general-purpose agent.
- Manual document updates.
- Manual screenshot/log inspection.
- Manual impact notes.
- No append-only ontology ledger.
- No SHACL governance.
- No macro inference.
- No lastring closure gate.

## Shared cases

Run the same 10 cases defined in `validation_version(withOntology)/design_evaluation.txt`.

## Measurement fields

For each case, record:

- start time,
- end time,
- time to first actionable failure diagnosis,
- documentation bounce count,
- small breaking change containment score,
- intersection resolution result,
- notes on evidence quality.

## Expected limitation

The baseline may produce plausible outputs, but it cannot reliably prove which agent/tool caused a change, which axiom was involved, or whether a final event chain is safe to close.
