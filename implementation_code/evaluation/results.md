# Evaluation Results Matrix

This matrix maps the shared 10 cases to baseline and ontology-governed evidence. Numeric timing cells are intentionally left as live-run fields; the current implementation supplies deterministic evidence and expected terminal status for each case.

| Case | Baseline expected limitation | Ontology evidence | Expected final status | Live-run fields |
| --- | --- | --- | --- | --- |
| CASE-01 | Manual notes can miss parent/child state boundaries. | `ex:transition_001`, `ex:validation_row_001` | `DONE_AUTON` | validated delivery time |
| CASE-02 | Invalid Draft -> Released jump may be noticed late. | `ex:transition_invalid_001`, `ex:validation_row_002`, `invalid_taxonomy.jsonld` | `ERRORED` | diagnosis time |
| CASE-03 | Parent Feature impact must be inferred manually. | `ex:transition_case03_rejected_partial`, `ex:validation_row_case03` | `DONE_AUTON` | intersection resolution |
| CASE-04 | Documentation impact depends on reviewer memory. | `ex:transition_case04_code_released`, `ex:validation_row_case04` | `WAITING` | doc bounce count |
| CASE-05 | Developer/documentation boundary is implicit. | `ex:transition_domain_breach_001`, `ex:validation_row_003` | `REJECTED` | diagnosis time |
| CASE-06 | Reverse domain breach is hard to prove after edits. | `ex:observability_row_case06`, `ex:validation_row_case06` | `REJECTED` | diagnosis time |
| CASE-07 | Visual evidence drift is usually undocumented. | `ex:observability_row_case07`, `ex:validation_row_case07` | `ONLY_WARNING_TS` | containment score |
| CASE-08 | Build/type warnings can be hidden by success-shaped summaries. | `ex:observability_row_case08`, `ex:validation_row_case08` | `ONLY_WARNING_TS` | containment score |
| CASE-09 | Concurrent previous activity conflicts require manual reconstruction. | `ex:observability_row_case09`, `ex:validation_row_case09` | `ERRORED` | intersection resolution |
| CASE-10 | Final closure can happen before warnings are accepted. | `ex:observability_row_case10`, `ex:validation_row_case10` | `WAITING_HF` | validated delivery time |

## Measurement table

Fill this table during the timed baseline and solution runs.

| Case | Baseline delivery time | Solution delivery time | Baseline diagnosis time | Solution diagnosis time | Baseline doc bounces | Solution doc bounces | Containment score | Intersection resolved |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CASE-01 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-02 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-03 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-04 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-05 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-06 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-07 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| CASE-08 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| CASE-09 | TBD | TBD | TBD | TBD | TBD | TBD | N/A | TBD |
| CASE-10 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## Route filters

- All CASE-07 visual evidence: `/validator?caseId=CASE-07`
- All domain isolation evidence: `/validator?axiomId=AXIOM-006`
- Case-specific axiom evidence: `/validator?caseId=CASE-10&axiomId=AXIOM-007`
