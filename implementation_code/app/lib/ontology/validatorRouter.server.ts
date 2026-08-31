import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ImmutableAuditLedger } from "./immutableLedger.server";
import { validateOntologyPayload } from "./shaclValidator.server";
import type { OntologyStatus, ValidatorRouteResult } from "./types";

const shapePath = resolve("ontology", "shapes.ttl");
const samplePayloadPath = resolve("ontology", "graph-payload.jsonld");

const ledger = new ImmutableAuditLedger();

type GraphNode = Record<string, unknown> & {
  "@id"?: string;
  "@type"?: string;
  axiomRef?: string;
  caseId?: string;
};

interface PayloadSummary {
  type: string;
  id: string;
}

export interface ValidatorReadinessFilters {
  axiomId?: string;
  caseId?: string;
}

function normalizeFilterValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function asFilterableValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function matchesOntologyId(value: unknown, filter: string | undefined) {
  if (!filter) return true;

  const nodeValue = asFilterableValue(value);
  return nodeValue === filter || nodeValue.endsWith(`#${filter}`) || nodeValue.endsWith(`:${filter}`);
}

function filterEvidenceRows(rows: GraphNode[], filters: ValidatorReadinessFilters) {
  const caseFilter = normalizeFilterValue(filters.caseId);
  const axiomFilter = normalizeFilterValue(filters.axiomId);

  return rows.filter((row) => {
    const matchesCase = !caseFilter || asFilterableValue(row.caseId) === caseFilter;
    const matchesAxiom = matchesOntologyId(row.axiomRef, axiomFilter);
    return matchesCase && matchesAxiom;
  });
}

function collectUniqueValues(rows: GraphNode[], field: "axiomRef" | "caseId") {
  return [...new Set(rows.map((row) => asFilterableValue(row[field])).filter(Boolean))].sort();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeJsonLdType(typeValue: unknown): string | undefined {
  if (typeof typeValue === "string" && typeValue.trim()) {
    return typeValue;
  }

  if (Array.isArray(typeValue)) {
    return typeValue.find((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  return undefined;
}

function summarizeJsonLdPayload(payload: unknown): PayloadSummary {
  if (Array.isArray(payload)) {
    return {
      type: "JsonLdNodeArray",
      id: `node-array:${payload.length}`,
    };
  }

  if (!isRecord(payload)) {
    throw new Response("JSON-LD payload must be an object or node array", {
      status: 400,
    });
  }

  const topLevelType = normalizeJsonLdType(payload["@type"] ?? payload.type);
  if (topLevelType) {
    return {
      type: topLevelType,
      id:
        typeof payload["@id"] === "string"
          ? payload["@id"]
          : typeof payload.id === "string"
            ? payload.id
            : "anonymous",
    };
  }

  const graph = payload["@graph"];
  if (Array.isArray(graph)) {
    const firstNodeWithId = graph.find(
      (node): node is Record<string, unknown> => isRecord(node) && typeof node["@id"] === "string",
    );

    return {
      type: "JsonLdGraph",
      id:
        typeof payload["@id"] === "string"
          ? payload["@id"]
          : firstNodeWithId
            ? String(firstNodeWithId["@id"])
            : `graph:${graph.length}`,
    };
  }

  throw new Response("JSON-LD payload must include @type, type, or @graph", {
    status: 400,
  });
}

export async function getValidatorReadiness(filters: ValidatorReadinessFilters = {}) {
  const samplePayload = await readFile(samplePayloadPath, "utf8");
  const graphPayload = JSON.parse(samplePayload) as { "@graph"?: Array<Record<string, unknown>> };
  const graph: GraphNode[] = Array.isArray(graphPayload["@graph"]) ? graphPayload["@graph"] : [];
  const evidenceRows = graph.filter(
    (node) => node["@type"] === "Execution" || node["@type"] === "ValidationResult",
  );

  return {
    implementation: "react-router-shacl-compatible",
    shapePath,
    samplePayload,
    filters: {
      axiomId: normalizeFilterValue(filters.axiomId) ?? "",
      caseId: normalizeFilterValue(filters.caseId) ?? "",
    },
    filterOptions: {
      axiomIds: collectUniqueValues(evidenceRows, "axiomRef"),
      caseIds: collectUniqueValues(evidenceRows, "caseId"),
    },
    observabilityRows: filterEvidenceRows(
      graph.filter((node) => node["@type"] === "Execution"),
      filters,
    ),
    validationRows: filterEvidenceRows(
      graph.filter((node) => node["@type"] === "ValidationResult"),
      filters,
    ),
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
  const payload = JSON.parse(incomingJsonLdPayload) as unknown;
  const payloadSummary = summarizeJsonLdPayload(payload);

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
    payloadSummary,
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
