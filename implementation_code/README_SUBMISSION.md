# Ontology-Governed Agent Workflow Submission

## Intended user and bottleneck

The intended user coordinates multiple coding agents and needs to prove what happened before accepting a final result. The bottleneck is not only generating code; it is reconstructing agent actions, validation failures, documentation impact, and final approval evidence.

## Solution

This implementation uses a React Router validator surface with ontology-governed evidence:

- micro-agent activity becomes append-only JSON-LD rows,
- ONTO_CONTROLLER is the only graph author,
- SHACL blocks invalid taxonomy, hierarchy, domain, concurrency, and lastring attempts,
- SPARQL query stubs derive macro-state from event history,
- `/validator` renders before-processing and struggling/validation views,
- lastring remains `WAITING_HF` until human approval.

## What was added for this submission

- `ontology/context.jsonld`, `ontology/shapes.ttl`, `ontology/graph-payload.jsonld`, and `ontology/inference.rq`.
- `scripts/validate-ontology.mjs` and `scripts/validate-evaluation.mjs`.
- `evaluation/cases.json`, `evaluation/baseline.md`, `evaluation/solution.md`, `evaluation/results.md`, and `evaluation/improvement_changelog.md`.
- React Router validator route and server-side validation/ledger integration.
- Five representative agent trajectories.

## Improvement changelog

See `evaluation/improvement_changelog.md`.

## Main failure mode

The baseline can produce plausible work while hiding provenance and risk. Without deterministic graph evidence, reviewers must manually infer which agent changed what, which validation rule applied, and whether documentation or final closure is safe.

## Hot take

Adding more agents is not the answer unless the workflow also adds deterministic boundaries. Agents should propose and execute work; semantic shields should govern acceptance.

## Reproduction

See `REPRODUCTION.md`.
