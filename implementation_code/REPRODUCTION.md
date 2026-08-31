# Reproduction Guide

This guide starts from a clean checkout and uses only local, synthetic/public project data.

## Requirements

- Node.js 22 or newer.
- npm from the Node.js installation.
- No credentials, external databases, paid services, or private data are required.

## Setup

```bash
cd implementation_code
npm install
```

## Validate ontology and evaluation evidence

```bash
npm run validate:ontology
npm run validate:evaluation
npm run typecheck
npm run build
```

Expected output:

- ontology graph integrity passes,
- all 10 evaluation cases map to graph validation evidence,
- 8/8 SHACL fixture expectations pass,
- evaluation docs and trajectories exist,
- React Router typecheck and production build complete.

Approximate runtime on a local development machine: under 2 minutes after dependencies are installed. Approximate cost: zero local runtime cost.

## Run the solution

```bash
npm run start
```

Open `http://localhost:3000/validator`. If port 3000 is unavailable:

```bash
set PORT=3210
npm run start
```

Then open `http://localhost:3210/validator`.

## Baseline run

Use `evaluation/baseline.md` and the same `evaluation/cases.json` dataset. Record manual results in `evaluation/results.md`.

## Solution run

Use `evaluation/solution.md`. Submit `ontology/graph-payload.jsonld` through `/validator` and inspect case-specific route filters.

## Data note

All graph IDs, cases, trajectories, and metrics are synthetic demonstration data. Do not add credentials or private user data to payloads, screenshots, trajectories, or reproduction notes.
