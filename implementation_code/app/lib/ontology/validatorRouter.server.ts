import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ImmutableAuditLedger } from "./immutableLedger.server";
import { validateOntologyPayload } from "./shaclValidator.server";
import type { OntologyStatus, ValidatorRouteResult } from "./types";

const shapePath = resolve("ontology", "shapes.ttl");
const samplePayloadPath = resolve("ontology", "graph-payload.jsonld");

const ledger = new ImmutableAuditLedger();

export async function getValidatorReadiness() {
  const samplePayload = await readFile(samplePayloadPath, "utf8");

  return {
    implementation: "react-router-shacl-compatible",
    shapePath,
    samplePayload,
    boundaries: [
      "ONTO_CONTROLLER authors graph payloads",
      "SHACL validates before execution or ingestion",
      "Immutable ledger records validation outcome",
      "Qdrant compatibility remains retrieval-only in this slice",
    ],
  };
}

export async function validateOntologySubmission(
  incomingJsonLdPayload: string,
): Promise<ValidatorRouteResult> {
  const payload = JSON.parse(incomingJsonLdPayload) as {
    "@type"?: unknown;
    type?: unknown;
    "@id"?: unknown;
    id?: unknown;
  };
  const type =
    typeof payload["@type"] === "string" ? payload["@type"] : payload.type;

  if (typeof type !== "string") {
    throw new Response("JSON-LD payload must include @type or type", {
      status: 400,
    });
  }

  const decision = await validateOntologyPayload({
    dataSource: incomingJsonLdPayload,
    dataFormat: "jsonld",
    shapeSource: shapePath,
  });

  const hasHardViolations = decision.errors.some(
    (error) => error.severity === "Violation",
  );
  const warnings = decision.errors.filter(
    (error) => error.severity === "Warning",
  );
  const status: ValidatorRouteResult["status"] = decision.conforms
    ? "PROCEED_TO_EXECUTION"
    : hasHardViolations
      ? "HARD_REJECTION_ABORT"
      : "ESCALATED_TO_HUMAN_IN_THE_LOOP";
  const ledgerStatus:
    | OntologyStatus
    | "PROCEED_TO_EXECUTION"
    | "HARD_REJECTION_ABORT" =
    status === "ESCALATED_TO_HUMAN_IN_THE_LOOP" ? "WAITING_HF" : status;
  const record = await ledger.appendLog({
    payloadSummary: {
      type,
      id:
        typeof payload["@id"] === "string"
          ? payload["@id"]
          : typeof payload.id === "string"
            ? payload.id
            : "anonymous",
    },
    status: ledgerStatus,
    validationErrors: decision.errors,
    payloadSnapshot: payload,
  });

  return {
    status,
    ledgerId: record.entryId,
    escalations: warnings.map((warning) => warning.message),
    conforms: decision.conforms,
    payload,
  };
}
