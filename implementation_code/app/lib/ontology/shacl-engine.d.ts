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
    validate(dataDataset: unknown): Promise<ShaclValidationReport>;
  }
}
