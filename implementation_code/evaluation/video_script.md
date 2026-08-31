# Five-Minute Solution Video Script

## 0:00-0:40 Problem and user

The user is building with several coding agents and needs judge-ready evidence, not just code. The bottleneck is reconstructing what happened after agents edit files, fail validations, or trigger documentation changes.

## 0:40-1:20 Baseline

Show `evaluation/baseline.md`. Explain that the baseline is a direct agent plus manual documentation loop. It can move quickly, but it does not preserve append-only state, SHACL decisions, macro inference, or lastring closure evidence.

## 1:20-2:30 Ontology-governed workflow

Show `ontology/graph-payload.jsonld`, `ontology/shapes.ttl`, and `ontology/inference.rq`. Explain that micro-agents do normal work, ONTO_CONTROLLER authors graph payloads, SHACL checks validity, and macro-state is inferred from history.

## 2:30-3:30 React Router validation surface

Run `npm run validate:ontology`, `npm run validate:evaluation`, and open `/validator`. Filter by `CASE-10` and `AXIOM-007` to show lastring waiting for human approval.

## 3:30-4:20 Results and changelog

Show `evaluation/results.md` and `evaluation/improvement_changelog.md`. Highlight the graph-submission fix: the validator now accepts full JSON-LD `@graph` payloads and returns `PROCEED_TO_EXECUTION`.

## 4:20-5:00 Insight

Close with the hot take: agents should not govern their own boundaries. The useful part is deterministic semantic evidence around agent work, not simply adding more agents.
