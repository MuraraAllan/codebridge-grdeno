// Reference-only partial.
// The real implementation is in app/lib/ontology/shaclValidator.server.ts.

export const shaclCompatibilityPartial = {
  input: "JSON-LD string or local file path",
  shapeSource: "ontology/shapes.ttl",
  engineFlow: ["JSON-LD", "N-Quads", "N3 Store", "SHACL Validator", "normalized decision"],
  output: ["conforms", "errors"],
};
