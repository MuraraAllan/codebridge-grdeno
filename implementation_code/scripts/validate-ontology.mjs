import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import jsonld from "jsonld";
import { DataFactory, Parser, Store } from "n3";
import { Validator } from "shacl-engine";
import { targetResolvers, validations } from "shacl-engine/sparql.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

async function loadToDataset(content, format) {
  const store = new Store();
  let graphData = content;
  if (format === "jsonld") {
    graphData = await jsonld.toRDF(JSON.parse(content), { format: "application/n-quads" });
    if (typeof graphData !== "string") throw new Error("JSON-LD expansion did not produce N-Quads text.");
  }
  return new Promise((resolvePromise, reject) => {
    const parser = new Parser({ format: format === "jsonld" ? "N-Quads" : "Turtle" });
    parser.parse(graphData, (error, quad) => {
      if (error) { reject(error); return; }
      if (quad) { store.addQuad(quad); return; }
      resolvePromise(store);
    });
  });
}

async function validateFixture(fixturePath, shapesPath, expectedConforms) {
  const dataContent = await readFile(fixturePath, "utf8");
  const shapeContent = await readFile(shapesPath, "utf8");
  const dataDataset = await loadToDataset(dataContent, "jsonld");
  const shapeDataset = await loadToDataset(shapeContent, "turtle");
  const validator = new Validator(shapeDataset, { factory: DataFactory, targetResolvers, validations });
  const report = await validator.validate({ dataset: dataDataset });
  const label = fixturePath.split(/[/\\]/).pop();

  if (report.conforms === expectedConforms) {
    console.log(`  PASS  ${label}  (conforms=${report.conforms} as expected)`);
    return true;
  }
  const messages = (report.results ?? []).map((r) => r.message ?? "?").join(" | ");
  console.error(`  FAIL  ${label}  (conforms=${report.conforms}, expected=${expectedConforms}) ${messages}`);
  return false;
}

console.log("\n-- Graph payload integrity --");
const payload = JSON.parse(await readFile(resolve(root, "ontology/graph-payload.jsonld"), "utf8"));
if (!Array.isArray(payload["@graph"])) throw new Error("graph-payload.jsonld must contain an @graph array.");
const ids = new Set(payload["@graph"].map((n) => n["@id"]).filter(Boolean));
const requiredIds = [
  "ex:doc_101", "ex:feat_ontology_validation", "ex:part_shacl_validator",
  "ex:transition_001", "ex:observability_row_001", "ex:validation_row_001",
  "ex:lastring_ontology_representation_task_list",
  "ex:transition_invalid_001", "ex:transition_domain_breach_001",
  "ex:transition_case03_rejected_partial", "ex:transition_case04_code_released",
  "ex:observability_row_case03", "ex:validation_row_case03",
  "ex:observability_row_case04", "ex:validation_row_case04",
  "ex:observability_row_case06", "ex:validation_row_case06",
  "ex:observability_row_case07", "ex:validation_row_case07",
  "ex:observability_row_case08", "ex:validation_row_case08",
  "ex:observability_row_case09", "ex:validation_row_case09",
  "ex:observability_row_case10", "ex:validation_row_case10",
];
for (const id of requiredIds) {
  if (!ids.has(id)) throw new Error(`Missing required graph node: ${id}`);
}
console.log("  PASS  graph-payload.jsonld contains all required nodes.");

const casesPayload = JSON.parse(await readFile(resolve(root, "evaluation/cases.json"), "utf8"));
const evaluationCases = Array.isArray(casesPayload.cases) ? casesPayload.cases : [];
if (evaluationCases.length !== 10) {
  throw new Error(`evaluation/cases.json must contain 10 cases; found ${evaluationCases.length}.`);
}

for (const evaluationCase of evaluationCases) {
  if (typeof evaluationCase.id !== "string") {
    throw new Error("Every evaluation case must include a string id.");
  }

  const graphRows = payload["@graph"].filter((node) => node.caseId === evaluationCase.id);
  const validationRows = graphRows.filter((node) => node["@type"] === "ValidationResult");
  if (graphRows.length === 0) {
    throw new Error(`No graph evidence found for ${evaluationCase.id}.`);
  }
  if (validationRows.length === 0) {
    throw new Error(`No validation evidence found for ${evaluationCase.id}.`);
  }
}
console.log("  PASS  evaluation/cases.json maps all 10 cases to graph validation evidence.");

console.log("\n-- SHACL fixture suite --");
const shapesPath = resolve(root, "ontology/shapes.ttl");
const fixturesDir = resolve(root, "ontology/fixtures");

const cases = [
  { file: "happy_path.jsonld",                  conforms: true  },
  { file: "invalid_taxonomy.jsonld",             conforms: false },
  { file: "invalid_immutable_anchor.jsonld",     conforms: false },
  { file: "invalid_hierarchy_scope_leak.jsonld", conforms: false },
  { file: "invalid_domain_breach_dev.jsonld",    conforms: false },
  { file: "invalid_domain_breach_doc.jsonld",    conforms: false },
  { file: "invalid_lastring_blocked.jsonld",     conforms: false },
  { file: "invalid_previousactivity_conflict.jsonld", conforms: false },
];

let passed = 0;
for (const { file, conforms } of cases) {
  const ok = await validateFixture(resolve(fixturesDir, file), shapesPath, conforms);
  if (ok) passed++;
}

console.log(`\n-- Result: ${passed}/${cases.length} fixture cases passed --`);
if (passed < cases.length) process.exit(1);
