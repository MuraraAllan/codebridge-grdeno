# Phase 8 Final Verification Checklist

This checklist keeps the final lifecycle honest. It verifies evidence readiness without pretending the final human approval has already happened.

| Gate | Plan task | Evidence | Current status | Close condition |
| --- | --- | --- | --- | --- |
| SHACL fixtures | `IMP-0801` | `npm run validate:ontology`; 8 fixture cases in `ontology/fixtures/` | Passed in first-pass validation | No unexpected valid/invalid fixture result. |
| Shared case run | `IMP-0802` | `evaluation/cases.json`; `evaluation/results.md` | Evidence mapped; live numeric fields remain `TBD` | Timed baseline and solution runs fill all measurement cells. |
| Ground rules | `IMP-0803` | `REPRODUCTION.md`; `README_SUBMISSION.md`; this checklist | Passed for first-pass packaging | No credentials/private data; consequential actions remain simulated or human-gated. |
| Final deliverables | `IMP-0804` | `README_SUBMISSION.md`; `REPRODUCTION.md`; `evaluation/video_script.md`; `trajectories/` | Assembled for first-pass review | Reviewer can assemble all four deliverables directly from repository files. |
| Lastring attempt | `IMP-0805` | `ex:observability_row_case10`; `ex:validation_row_case10`; `ex:lastring_ontology_representation_task_list` | `WAITING_HF` | Hard failures resolved and warning evidence accepted by human reviewer. |
| Human closure | `IMP-0806` | Future human approval record | Not closed | `DONE_HF requires explicit human approval`; do not synthesize this transition. |

## Eligibility checks

- Public/synthetic data only: pass.
- Credentials in graph, trajectories, docs, or screenshots: none intentionally added.
- Consequential actions: simulated or gated by Human Reviewer.
- ONTO_CONTROLLER graph authorship boundary: preserved.
- Agent trajectories: Developer, Documentation, QA, ONTO_CONTROLLER, and Human Reviewer present.
- Reproduction path: local npm commands, no external service required.

## Lastring guard

The current graph intentionally keeps `ex:lastring_ontology_representation_task_list` at `WAITING_HF`.

Do not change it to `DONE_HF` until:

1. live baseline/final numeric results are entered in `evaluation/results.md`,
2. warning evidence for `CASE-07`, `CASE-08`, and `CASE-10` is resolved or explicitly accepted,
3. a human reviewer approves closure,
4. the approval is recorded as evidence rather than implied by a successful build.
