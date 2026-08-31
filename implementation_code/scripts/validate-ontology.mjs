import { readFile } from "node:fs/promises";

const payload = JSON.parse(
  await readFile(new URL("../ontology/graph-payload.jsonld", import.meta.url), "utf8"),
);

if (!Array.isArray(payload["@graph"])) {
  throw new Error("graph-payload.jsonld must contain an @graph array.");
}

const ids = new Set(payload["@graph"].map((node) => node["@id"]).filter(Boolean));
const requiredIds = [
  "ex:doc_101",
  "ex:feat_ontology_validation",
  "ex:part_shacl_validator",
  "ex:transition_001",
  "ex:observability_row_001",
  "ex:validation_row_001",
  "ex:lastring_ontology_representation_task_list",
];

for (const id of requiredIds) {
  if (!ids.has(id)) {
    throw new Error(`Missing required graph node: ${id}`);
  }
}

console.log("Ontology graph payload contains required migrated implementation nodes.");
