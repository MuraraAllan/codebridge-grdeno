import { readFile } from "node:fs/promises";

import jsonld from "jsonld";
import { DataFactory, Parser, Store } from "n3";
import type { Quad } from "n3";
import { Validator } from "shacl-engine";
import { targetResolvers, validations } from "shacl-engine/sparql.js";

import type {
  OntologyValidationDecision,
  OntologyValidationError,
} from "./types";

async function fetchResource(source: string): Promise<string> {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(
        `Fetch failed for ${source}: ${response.status} ${response.statusText}`,
      );
    }
    return response.text();
  }

  return readFile(source, "utf8");
}

async function loadToDataset(
  content: string,
  format: "jsonld" | "turtle",
): Promise<Store> {
  const store = new Store();
  const graphData = format === "jsonld"
    ? await jsonLdToNQuads(content)
    : content;

  return new Promise((resolve, reject) => {
    const parser = new Parser({
      format: format === "jsonld" ? "N-Quads" : "Turtle",
    });
    parser.parse(graphData, (error: Error | null, quad: Quad | null) => {
      if (error) {
        reject(error);
        return;
      }

      if (quad) {
        store.addQuad(quad);
        return;
      }

      resolve(store);
    });
  });
}

async function jsonLdToNQuads(content: string): Promise<string> {
  const rdf = await jsonld.toRDF(JSON.parse(content), {
    format: "application/n-quads",
  });

  if (typeof rdf !== "string") {
    throw new Error("JSON-LD expansion did not produce N-Quads text.");
  }

  return rdf;
}

function normalizeValidationErrors(
  results: Array<{
    severity?: { value?: string };
    message?: string;
    focusNode?: { value?: string };
    path?: { value?: string };
  }>,
): OntologyValidationError[] {
  return results.map((result) => {
    const severityValue = result.severity?.value ?? "";
    const severity = severityValue.endsWith("Warning")
      ? "Warning"
      : severityValue.endsWith("Info")
        ? "Info"
        : "Violation";

    return {
      severity,
      message: result.message ?? "Rule constraint alert.",
      focusNode: result.focusNode?.value,
      resultPath: result.path?.value,
    };
  });
}

export async function validateOntologyPayload({
  dataSource,
  dataFormat,
  shapeSource,
}: {
  dataSource: string;
  dataFormat: "jsonld";
  shapeSource: string;
}): Promise<OntologyValidationDecision> {
  const dataContent = dataSource.trim().startsWith("{")
    ? dataSource
    : await fetchResource(dataSource);
  const shapeContent = await fetchResource(shapeSource);

  const dataDataset = await loadToDataset(dataContent, dataFormat);
  const shapeDataset = await loadToDataset(shapeContent, "turtle");

  const validator = new Validator(shapeDataset, {
    factory: DataFactory,
    targetResolvers,
    validations,
  });
  const report = await validator.validate({ dataset: dataDataset });

  if (report.conforms) {
    return { conforms: true, errors: [] };
  }

  return {
    conforms: false,
    errors: normalizeValidationErrors(report.results ?? []),
  };
}
