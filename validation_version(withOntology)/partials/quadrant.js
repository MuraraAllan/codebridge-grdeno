# partial refered requests  <<< Reflect(>> make sure to retrieve from website how to build in Typescript.

PUT /collections/test 
{
  "vectors": {
    "test": {
      "size": 1536,
      "distance": "Euclid",
      "on_disk": true,
      "hnsw_config": {
        "m": 0,
        "payload_m": 24,
        "ef_construct": 256
      },
      "datatype": "float32"
    }
  },
  "sparse_vectors": {
    "test": {
      "index": {
        "on_disk": true
      },
      "modifier": "idf"
    }
  }
}

// Payload Indexes
PUT /collections/test/index 
{
  "field_name": "test",
  "field_schema": {
    "type": "keyword",
    "on_disk": false,
    "is_tenant": true,
    "is_principal": true
  }
}