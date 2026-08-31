# Ontology-Governed Solution Runner

This runner uses the same 10 cases in `evaluation/cases.json` as the baseline. The difference is that agent activity is converted into JSON-LD graph evidence by ONTO_CONTROLLER, checked by SHACL, rendered through the React Router validator route, and preserved in the append-only ledger.

## Commands

From `implementation_code`:

```bash
npm install
npm run validate:ontology
npm run validate:evaluation
npm run typecheck
npm run build
npm run start
```

Open `http://localhost:3000/validator` after `npm run start`, or set `PORT=3210` before starting if port 3000 is unavailable.

## Run sequence

1. Load `ontology/graph-payload.jsonld` in `/validator`.
2. Confirm the action result returns `PROCEED_TO_EXECUTION` for the full `@graph` payload.
3. Use the route filters to inspect case-specific evidence:
   - `/validator?caseId=CASE-02`
   - `/validator?axiomId=AXIOM-006`
   - `/validator?caseId=CASE-10&axiomId=AXIOM-007`
4. Compare each case against `evaluation/results.md`.
5. Confirm lastring remains `WAITING_HF` until a human reviewer accepts warning evidence.

## Measurement fields

Record these values per case:

- validated delivery time,
- time to first actionable failure diagnosis,
- documentation bounce count,
- small breaking change containment score,
- intersection resolution result,
- evidence quality notes.

The first implementation pass uses static graph evidence and command validation. A live timed run should fill the numeric cells in `evaluation/results.md`.
