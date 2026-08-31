export type OntologyMode = "BEING" | "BECOMING";

export type OntologyEventType =
  | "CHAIN_CALL"
  | "SUBSEQUENT_CHAIN_CALL"
  | "EVENT_TRIGGER"
  | "LANDSCAPE_MERGE";

export type OntologyStatus =
  | "PENDING"
  | "WAITING"
  | "WAITING_HF"
  | "DONE_AUTO"
  | "DONE_AUTON"
  | "DONE_HF"
  | "ONLY_WARNING_TS"
  | "ERRORED"
  | "REJECTED";

export type ValidationSeverity = "Violation" | "Warning" | "Info";

export interface OntologyValidationError {
  severity: ValidationSeverity;
  message: string;
  focusNode?: string;
  resultPath?: string;
}

export interface OntologyValidationDecision {
  conforms: boolean;
  errors: OntologyValidationError[];
}

export interface LedgerRecord {
  timestamp: string;
  entryId: string;
  previousHash: string | null;
  hash: string;
  payloadSummary: {
    type: string;
    id: string;
  };
  status: OntologyStatus | "PROCEED_TO_EXECUTION" | "HARD_REJECTION_ABORT";
  validationErrors: OntologyValidationError[];
  payloadSnapshot: unknown;
}

export interface ValidatorRouteResult {
  status:
    | "PROCEED_TO_EXECUTION"
    | "HARD_REJECTION_ABORT"
    | "ESCALATED_TO_HUMAN_IN_THE_LOOP";
  ledgerId: string;
  escalations: string[];
  conforms: boolean;
  payload: unknown;
}
