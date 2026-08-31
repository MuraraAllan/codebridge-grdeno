import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function assertFile(path, label) {
  const content = await readFile(path, "utf8");
  if (!content.trim()) {
    throw new Error(`${label} is empty: ${path}`);
  }
  return content;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("\n-- Evaluation harness integrity --");

const casesPath = resolve(root, "evaluation/cases.json");
const resultsPath = resolve(root, "evaluation/results.md");
const graphPath = resolve(root, "ontology/graph-payload.jsonld");
const casesPayload = await readJson(casesPath);
const graphPayload = await readJson(graphPath);
const graphNodes = Array.isArray(graphPayload["@graph"]) ? graphPayload["@graph"] : [];
const graphIds = new Set(graphNodes.map((node) => node["@id"]).filter(Boolean));

assert(Array.isArray(casesPayload.cases), "evaluation/cases.json must contain a cases array.");
assert(casesPayload.cases.length === 10, `Expected 10 evaluation cases; found ${casesPayload.cases.length}.`);

for (const evaluationCase of casesPayload.cases) {
  assert(typeof evaluationCase.id === "string", "Each evaluation case must include id.");
  assert(evaluationCase.expectedEvidence, `${evaluationCase.id} must include expectedEvidence.`);

  const graphRows = evaluationCase.expectedEvidence.graphRows ?? [];
  const validationRows = evaluationCase.expectedEvidence.validationRows ?? [];
  assert(graphRows.length > 0, `${evaluationCase.id} must reference graph rows.`);
  assert(validationRows.length > 0, `${evaluationCase.id} must reference validation rows.`);

  for (const id of [...graphRows, ...validationRows]) {
    assert(graphIds.has(id), `${evaluationCase.id} references missing graph node ${id}.`);
  }

  const matchingGraphNodes = graphNodes.filter((node) => node.caseId === evaluationCase.id);
  assert(matchingGraphNodes.length > 0, `${evaluationCase.id} has no graph payload rows tagged with caseId.`);
}

console.log("  PASS  all 10 cases reference existing graph and validation evidence.");

const requiredDocs = [
  ["evaluation/baseline.md", "baseline runner"],
  ["evaluation/solution.md", "solution runner"],
  ["evaluation/results.md", "results matrix"],
  ["evaluation/improvement_changelog.md", "improvement changelog"],
  ["evaluation/video_script.md", "video script"],
  ["REPRODUCTION.md", "reproduction guide"],
  ["README_SUBMISSION.md", "submission README"],
];

const results = await assertFile(resultsPath, "results matrix");
for (const evaluationCase of casesPayload.cases) {
  assert(results.includes(evaluationCase.id), `results matrix must mention ${evaluationCase.id}.`);
}
console.log("  PASS  results matrix covers every shared case.");

for (const [relativePath, label] of requiredDocs) {
  await assertFile(resolve(root, relativePath), label);
}
console.log("  PASS  final documentation files exist.");

const trajectoryFiles = [
  "dev_agent_a.md",
  "doc_agent_a.md",
  "qa_agent_a.md",
  "onto_controller.md",
  "human_reviewer.md",
];
for (const file of trajectoryFiles) {
  const content = await assertFile(resolve(root, "trajectories", file), file);
  for (const requiredPhrase of ["Role:", "Starting event:", "Tool/validation response:", "Retry/correction:", "Final state:", "Human checkpoint:"]) {
    assert(content.includes(requiredPhrase), `${file} must include ${requiredPhrase}`);
  }
}
console.log("  PASS  five required agent trajectories are complete enough for review.");

console.log("\n-- Result: evaluation harness passed --");
