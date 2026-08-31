export const qdrantOntologyCollectionPlan = {
  collectionName: "ontology_events",
  vectors: {
    semantic_event_vector: {
      size: 1536,
      distance: "Euclid",
      on_disk: true,
      datatype: "float32",
      hnsw_config: {
        m: 0,
        payload_m: 24,
        ef_construct: 256,
      },
    },
  },
  sparse_vectors: {
    lexical_event_vector: {
      index: {
        on_disk: true,
      },
      modifier: "idf",
    },
  },
  payloadIndexes: [
    { field_name: "tenantId", field_schema: { type: "keyword", is_tenant: true } },
    { field_name: "landscapeRef", field_schema: { type: "keyword" } },
    { field_name: "ontologyMode", field_schema: { type: "keyword" } },
    { field_name: "axiomRef", field_schema: { type: "keyword" } },
    { field_name: "targetNode", field_schema: { type: "keyword" } },
    { field_name: "submittedBy", field_schema: { type: "keyword" } },
    { field_name: "status", field_schema: { type: "keyword" } },
    { field_name: "dateOccurrence", field_schema: { type: "datetime" } },
  ],
} as const;

export function getQdrantContextualUnderstanding() {
  return {
    role: "retrieval-acceleration-not-source-of-truth",
    sourceOfTruth: "immutable-ledger-and-jsonld-graph",
    validationBoundary: "SHACL validates before Qdrant ingestion",
    collectionPlan: qdrantOntologyCollectionPlan,
  };
}
