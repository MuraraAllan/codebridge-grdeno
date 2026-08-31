// Reference-only partial.
// The real compatibility contract is in app/lib/ontology/qdrantCollections.ts.

export const qdrantCollectionPartial = {
  collectionName: "ontology_events",
  denseVector: {
    name: "semantic_event_vector",
    size: 1536,
    distance: "Euclid",
  },
  sparseVector: {
    name: "lexical_event_vector",
    modifier: "idf",
  },
  payloadPartitioning: ["tenantId", "landscapeRef", "ontologyMode", "axiomRef", "targetNode"],
  note: "Qdrant accelerates retrieval; SHACL and the immutable ledger remain authoritative.",
};
