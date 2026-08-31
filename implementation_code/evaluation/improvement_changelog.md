# Improvement Changelog

| Stage | Change | Evidence | Decision |
| --- | --- | --- | --- |
| Baseline | Direct agent/manual documentation loop. | `evaluation/baseline.md`; CASE-01 through CASE-10 limitations in `evaluation/results.md`. | Keep as fair comparison path only. |
| Iteration 1 | Added append-only ontology event contract. | `ontology/context.jsonld`; `ex:transition_001`; `ex:observability_row_001`. | Keep; it makes lifecycle movement inspectable. |
| Iteration 2 | Added deterministic SHACL governance. | `ontology/shapes.ttl`; eight fixtures in `ontology/fixtures`; `npm run validate:ontology`. | Keep; invalid taxonomy, scope, domain, concurrency, and lastring cases are rejected. |
| Iteration 3 | Added macro inference queries. | `ontology/inference.rq`; CASE-03 and CASE-04 graph rows. | Keep; parent and documentation states are derived instead of directly mutated. |
| Iteration 4 | Added React Router validation surface. | `/validator`; case ID and axiom ID filters in `app/routes/validator.tsx`. | Keep; evidence is visible before final closure. |
| Iteration 5 | Fixed full JSON-LD graph submission. | `app/lib/ontology/validatorRouter.server.ts`; functional POST of `ontology/graph-payload.jsonld` returned `PROCEED_TO_EXECUTION`. | Keep; users can validate the actual graph payload, not only single-node snippets. |
| Removed experiment | Letting individual agents write graph payloads directly. | Domain isolation and ONTO_CONTROLLER boundaries in graph evidence. | Remove; graph authorship stays isolated to ONTO_CONTROLLER. |

## Main failure mode

The baseline failure mode is success-shaped output without durable proof. A direct agent can produce plausible code or docs, but later reviewers have to reconstruct which agent acted, what failed, which domain boundary applied, and whether documentation was synchronized.

## Hot take

LLM agents should not govern their own architectural boundaries. Semantic shields, append-only evidence, and human closure gates are boring on purpose, and that makes multi-agent work safer to trust.
