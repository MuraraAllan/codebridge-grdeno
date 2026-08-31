declare module "shacl-engine" {
  interface ShaclValidationResult {
    severity?: { value?: string };
    message?: string;
    focusNode?: { value?: string };
    path?: { value?: string };
  }

  interface ShaclValidationReport {
    conforms: boolean;
    results?: ShaclValidationResult[];
  }

  export class Validator {
    constructor(shapeDataset: unknown, options?: unknown);
    validate(data: { dataset: unknown }): Promise<ShaclValidationReport>;
  }
}

declare module "shacl-engine/sparql.js" {
  export const targetResolvers: unknown;
  export const validations: unknown;
}
