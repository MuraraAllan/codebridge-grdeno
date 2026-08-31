# Ontology Representation Task List

This document materializes the session artifact `Ontology representation task list` into the codebase and extends it into an implementation-oriented `extendedTasklist`.

## ContextTaskInterpreting

FeedForward(>>>> Build a representation of the strangling/shackling ontology by preserving macro/static anchors while allowing micro-autonomous tasks, executions, documents, and validations to proceed through append-only events.)

The implementation target is a hybrid ontology where:

- `BEING` is the stable macro layer: documents, features, partials, landscapes, and final lifecycle rings keep their identity.
- `BECOMING` is the process layer: tasks, tool calls, file reads/writes, validation attempts, and merges become `StateTransition` events.
- SHACL shields prevent agents from crossing domain boundaries.
- SPARQL or equivalent inference derives macro-state instead of mutating parent anchors directly.
- Human feedback gates consequential merge and lastring registration events.

## userMessageTaskList

The provided session todo artifact contains these base tasks:

| ID | Task | Base description |
| --- | --- | --- |
| `ontology-domain-model` | Modeling ontology domain anchors | Define the Being/static anchor model for Document, Feature, Partial, Task, Execution, Agent, and StateTransition identifiers. Preserve static identity for anchors while representing state changes only as process-layer events. |
| `state-taxonomy` | Defining state transition taxonomy | Implement the lifecycle taxonomy from Draft to Review to Approved/Released with Rejected review loops and inferred documentation states such as Inferred: Outdated where required by macro-resolution. |
| `append-only-event-store` | Creating append-only provenance ledger | Represent every mutation as a new StateTransition/Activity event with timestamp, target reference, actor, tool/software, commit/branch, and landscape/domain metadata. Never overwrite historical state. |
| `shacl-governance` | Implementing SHACL governance shields | Add SHACL validation for legal toState values, one target/fromState/toState per transition, forbidden Draft to Released jumps, target isolation, and horizontal domain boundaries between development and documentation agents. |
| `macro-inference-engine` | Building macro inference engine | Implement SPARQL or equivalent rule evaluation so superior component states and documentation outdated signals are derived from dependency event history instead of direct lower-level mutation. |
| `graph-payload-generator` | Generating representation graph payload | Create a POC JSON-LD/RDF graph-payload representation of the strangling/shackling model, grounded in submissions context and hybrid ontology theory, including anchors, events, provenance, and validation metadata. |
| `observability-event-view` | Designing observability event view | Expose representative event trajectories with fields such as occurrence date, submitted by, type, landscape/domain, target, status, assignee, and human-in-the-loop checkpoints. |
| `harness-risk-confirmation` | Composing harness risk confirmation | Ensure risky actions in the hook harness request confirmation with `ask` instead of denying agent flow, while avoiding uncommenting or extending validate-tool beyond ecosystem composition. |
| `validation-fixtures` | Writing ontology validation fixtures | Add valid and invalid fixtures for append-only transitions, partial autonomy, non-inverse propagation, static identity, domain isolation, and macro inference outcomes. |
| `submission-evidence-pack` | Preparing submission evidence pack | Map implementation outputs to hackathon requirements: README problem/value, baseline comparison, improvement changelog, reproduction guide, representative agent trajectories, main failure mode, hot take, and 5-minute walkthrough plan. |

## userMessageIntention

Create a codebase-resident file that extends the existing todo artifact into a richer implementation task list, with mandatory observability and validation views derived from the supplied screenshots.

## userMessageContextualDescription

The screenshots define two required minimum views before implementation continues:

1. An observability/event-stream screen showing occurrences across `BEING` and `BECOMING`, including agent ownership, temporary landscapes, waiting states, done states, and final merge.
2. A struggling/validation screen showing detailed reasoning, duration, tokens, status, and errored flags before or during validation.

This document registers those views as first-class deliverables instead of treating them as incidental UI mockups.

## Mandatory View 1: Before-Processing Observability

This view is required before processing so the agent flow is observable before actions are executed or merged.

| Column | Purpose | Example values |
| --- | --- | --- |
| `Occurency` | Append-only event name. | `WEBSITE_ACCESS`, `FILE_READ`, `FILE_WRITE`, `TOOL_CALL`, `MERGE_CHANGES`, `REGISTER_LASTRING` |
| `LANDSCAPE` | Ontological mode for the event. | `BECOMING`, `BEING (STATIC)` |
| `Details` | Human-readable action detail. | `Read local version in parallel`, `Detected Documentation Change`, `HAPPY-PATH - KUDOS MICRO1` |
| `Type` | Event category. | `CHAIN_CALL`, `SUBSEQUENT_CHAIN_CALL`, `EVENT_TRIGGER`, `LANDSCAPE_MERGE` |
| `LandscapeRef` | Branch, temporary context, or macro landscape. | `Temp_FeatureABC`, `MAIN` |
| `DNS_SECURITY_REVIEW` | Security/permission signal for external or risky actions. | `UNKNOWN`, `PENDING`, checked |
| `Submitted by` | Agent or person that submitted the event. | `DEV_AGENT_A`, `DOC_AGENT_A`, `ONTO_CONTROLLER`, `QA_AGENT_A`, `Allan Murara` |
| `DateOccurrency` | Event occurrence timestamp or relative time. | `35 minutes ago`, ISO timestamp |
| `Assignee` | Human or agent accountable for the next gate. | `Allan Murara (you)`, unassigned |
| `Status` | Current event status. | `PENDING`, `WAITING`, `DONE_AUTO`, `DONE_HF` |

### View 1 acceptance

- It must display pending work before mutation.
- It must distinguish `BEING` from `BECOMING`.
- It must expose human feedback gates before merge.
- It must retain every event row instead of overwriting previous status.

## Mandatory View 2: Struggling / Validation

This view is required to show validation friction, reasoning traces, warnings, and failed execution loops.

| Column | Purpose | Example values |
| --- | --- | --- |
| `Occurency` | Decision, edit, read, command, or validation event. | `DECISION_1`, `EDIT_FILE_1_DECISION_1`, `FILE_READ`, `RUN_COMMAND` |
| `DETAILED_REASONING` | Bounded explanation of why the event exists. | `Assembling state and lifecycle representation`, `npm run build -> TypeScript errors` |
| `INTEGER_DURATION` | Duration bucket or measured runtime. | `6`, `X`, `Y`, `Z`, `A`, `B`, `C` |
| `TOKENS` | Token/cost trace. | `300.0`, `01` |
| `Status` | Validation outcome. | `DONE_AUTON`, `ONLY_WARNING_TS`, `ERRORED`, `WAITING_HF` |
| `ERRORED` | Explicit boolean failure flag. | checked, unchecked |

### Recommended validation extensions

| Column | Purpose |
| --- | --- |
| `ValidationRule` | Names the SHACL, build, lint, or ontology rule being evaluated. |
| `SHACLMessage` | Captures the exact violation message without hiding it. |
| `TargetNode` | Identifies the affected Document, Feature, Partial, Task, or StateTransition. |
| `RecoveryAction` | Describes the next autonomous or human correction step. |
| `RetryCount` | Keeps retries visible as append-only process facts. |
| `CommitHash` | Links validation to provenance. |
| `Branch` | Preserves landscape context. |

### View 2 acceptance

- It must show warnings and failures instead of normalizing them into success.
- It must preserve command/build/type-check failures as visible validation events.
- It must distinguish autonomous completion from human-approved completion.
- It must make recovery steps traceable.

## extendedTasklist

| ID | Parent todo | Task | Owner | Ontology mode | Event type | Status | Output |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `EXT-001` | `ontology-domain-model` | Register static anchors for `Document`, `Feature`, `Partial`, `Task`, `Execution`, `Agent`, `Landscape`, and `Lastring`. | `ONTO_CONTROLLER` | `BEING` | `EVENT_TRIGGER` | `PENDING` | Ontology vocabulary section or schema. |
| `EXT-002` | `ontology-domain-model` | Define target identifiers for every anchor so events can reference anchors without mutating them. | `ONTO_CONTROLLER` | `BEING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Stable URI/ID convention. |
| `EXT-003` | `state-taxonomy` | Normalize lifecycle states: `Draft`, `Review`, `Approved`, `Released`, `Rejected`, `InferredOutdated`, `WaitingHumanFeedback`, `DoneAutonomous`, `DoneHumanFeedback`. | `QA_AGENT_A` | `BEING` | `EVENT_TRIGGER` | `PENDING` | State taxonomy table. |
| `EXT-004` | `append-only-event-store` | Define the `StateTransition` record shape with target, fromState, toState, timestamp, actor, tool, branch, commit, landscape, and validation reference. | `DEV_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Event payload contract. |
| `EXT-005` | `append-only-event-store` | Add append-only storage semantics: correction creates a new event; no historical row is overwritten. | `DEV_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Persistence rule and fixtures. |
| `EXT-006` | `shacl-governance` | Add state-machine validation: one `toState`, legal states only, and no direct `Draft` to `Released` transition. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | SHACL shape and invalid fixture. |
| `EXT-007` | `shacl-governance` | Add target-isolation validation so Partial events cannot directly mutate Feature or Document properties. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | SHACL shape and violation message. |
| `EXT-008` | `shacl-governance` | Add horizontal domain shielding so Developer agents cannot mutate documentation anchors and Documentation agents cannot mutate code anchors. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Domain shield rule. |
| `EXT-009` | `macro-inference-engine` | Derive Feature and Document macro-state from dependent StateTransition history. | `ONTO_CONTROLLER` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | SPARQL/inference query. |
| `EXT-010` | `macro-inference-engine` | Emit `InferredOutdated` documentation signals when released code changes require document synchronization. | `ONTO_CONTROLLER` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Inference event contract. |
| `EXT-011` | `graph-payload-generator` | Generate a POC JSON-LD graph payload containing static anchors, events, agents, provenance, and validation metadata. | `DOC_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | `graph-payload.jsonld` or equivalent. |
| `EXT-012` | `observability-event-view` | Implement or document Mandatory View 1 before-processing observability columns. | `DOC_AGENT_A` | `BECOMING` | `CHAIN_CALL` | `PENDING` | Event-stream view definition. |
| `EXT-013` | `observability-event-view` | Implement or document Mandatory View 2 struggling/validation columns. | `QA_AGENT_A` | `BECOMING` | `CHAIN_CALL` | `PENDING` | Validation/debug view definition. |
| `EXT-014` | `harness-risk-confirmation` | Route risky tool, file, commit, merge, and external website actions to `ask` confirmation instead of deny. | `HARNESS_AGENT` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Confirmation policy task. |
| `EXT-015` | `validation-fixtures` | Add valid happy-path fixture from website/tool/file events through document sync and merge. | `QA_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Happy-path fixture. |
| `EXT-016` | `validation-fixtures` | Add invalid struggling fixtures for TypeScript/build errors, SHACL violations, cross-domain mutation, and unresolved warnings. | `QA_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Validation failure fixtures. |
| `EXT-017` | `submission-evidence-pack` | Register representative agent trajectories for every major owner: Developer, Documentation, Ontology Controller, QA, and Human Reviewer. | `DOC_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Trajectory evidence section. |
| `EXT-018` | `submission-evidence-pack` | Map the implementation to hackathon deliverables: problem/value, baseline, changelog, reproduction, failure mode, hot take, and video plan. | `DOC_AGENT_A` | `BEING` | `LANDSCAPE_MERGE` | `PENDING` | Submission readiness checklist. |
| `EXT-019` | `lastring-registration` | Define `Lastring` as the final registered lifecycle ring that closes a validated event chain. | `ONTO_CONTROLLER` | `BEING` | `EVENT_TRIGGER` | `PENDING` | Lastring vocabulary entry. |
| `EXT-020` | `lastring-registration` | Add `REGISTER_LASTRING` as an append-only event that references source artifact, generated file path, validation result, approver, and timestamp. | `ONTO_CONTROLLER` | `BECOMING` | `LANDSCAPE_MERGE` | `WAITING_HF` | Final registration event contract. |
| `EXT-021` | `lastring-registration` | Block lastring registration while any required event remains `PENDING`, `WAITING`, `ERRORED`, or `ONLY_WARNING_TS` without human acceptance. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Lastring validation rule. |
| `EXT-022` | `lastring-registration` | Add a final observability row for `REGISTER_LASTRING` in `MAIN` after human feedback approves the merge. | `Human Reviewer` | `BEING` | `LANDSCAPE_MERGE` | `WAITING_HF` | Visible final lifecycle row. |

## Strangling and Shackling Axiom Iteration

This section extends the `extendedTasklist` by iterating over each axiom representation present in `strangling_and_shacling.md` and the root `axioms` reference. In this document:

- `Strangling` means the upper-boundary layer constrains what a lower/micro process is allowed to affect.
- `Shackling` means deterministic validation binds each autonomous event to an explicit state, target, actor, timestamp, and recovery path.
- `Last-ring` means the final registered lifecycle ring that can only close after the event chain conforms or a human accepts a warning state.

| Axiom | Representation | Strangling role | Shackling guard | Required view evidence | Implementation tasks |
| --- | --- | --- | --- | --- | --- |
| `AXIOM-001` Asynchrony / Temporal Independence | Component timelines are parallel event streams, not a single synchronized lockstep flow. | Prevents one Partial, Feature, Document, or agent lane from blocking all other lanes. | Every `StateTransition` must carry its own timestamp and must be queryable without rewriting sibling timelines. | View 1 shows multiple `BECOMING` rows with independent `DateOccurrency`; View 2 keeps each command/decision duration separate. | Add event timestamp indexing, timeline filtering, and fixtures proving a Partial transition at `t1` does not halt a Feature transition at `t2`. |
| `AXIOM-002` Non-Inverse Propagation / Scope Isolation | Lower-level activity does not mutate direct properties of a superior anchor. | The parent Feature/Document acts as an upper boundary around Partial autonomy. | `HierarchyShieldShape` rejects lower-target events that also declare parent state changes. | View 1 shows the event target and parent landscape separately; View 2 shows SHACL violation details when a scope leak appears. | Add target hierarchy metadata, parent-state mutation detection, and invalid fixture for Partial-to-Feature leakage. |
| `AXIOM-003` Static Identity / Immutable Being | `Document`, `Feature`, and `Partial` anchors retain URI identity while state changes occur elsewhere. | Macro anchors are strangling boundaries: they can be referenced but not rewritten by process events. | Anchor records must not contain mutable status fields; state must be reified into Activity/StateTransition nodes. | View 1 marks macro rows as `BEING (STATIC)` and event rows as `BECOMING`; View 2 references anchor IDs as `TargetNode`. | Add schema checks that anchors have stable IDs and no mutable lifecycle fields; add fixture where `ex:doc_101` survives simultaneous child transitions. |
| `AXIOM-004` Zero-Mutation / Append-Only Provenance | Past states cannot be overwritten, deleted, or directly modified. | Historical event rows become immutable boundaries around the audit trail. | Updates create new `StateTransition` events; current state is derived from latest `prov:endedAtTime`. | View 1 preserves all occurrences; View 2 preserves failed attempts and warnings instead of replacing them with success. | Add append-only storage rule, previous-event linking, correction-event pattern, and query for current state by latest timestamp. |
| `AXIOM-005` Automatous Inference / Macro-Resolution | Superior operational status is inferred from dependency event history. | Macro layers can react without allowing micro-agents to write macro state directly. | SPARQL or equivalent inference emits macro projections such as `BlockedByPartial` and `InferredOutdated`. | View 1 shows `ONTO_CONTROLLER` `EVENT_TRIGGER` rows; View 2 records inference failures or warning-only projections. | Add macro inference query set, inferred-state vocabulary, and fixtures for Rejected Partial -> Blocked Feature and Released Code -> Outdated Docs. |
| `AXIOM-006` Horizontal Domain Isolation / Strict Bounding | Agent provenance establishes absolute target scope. | Development and documentation domains are mutually bounded lanes. | `DomainIsolationShape` rejects Developer-to-Document and Document-to-Code transitions before graph commit. | View 1 shows `Submitted by`, `LandscapeRef`, and domain-specific owner rows; View 2 records cross-domain SHACL messages. | Add agent domain scope metadata, target class checks, and invalid fixtures for Developer documentation mutation and Document pipeline code mutation. |

### Axiom-Derived extendedTasklist Additions

| ID | Parent todo | Task | Owner | Ontology mode | Event type | Status | Output |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `AXT-001` | `append-only-event-store` | Add independent timeline indexes for Document, Feature, Partial, Task, and Execution event streams. | `ONTO_CONTROLLER` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Timestamp-filterable event stream. |
| `AXT-002` | `validation-fixtures` | Prove asynchrony with two parallel StateTransitions that do not block or overwrite each other. | `QA_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Asynchrony fixture. |
| `AXT-003` | `shacl-governance` | Implement hierarchy shielding for non-inverse propagation. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | `HierarchyShieldShape`. |
| `AXT-004` | `ontology-domain-model` | Add immutable anchor validation so `Document`, `Feature`, and `Partial` nodes do not carry direct mutable status. | `ONTO_CONTROLLER` | `BEING` | `EVENT_TRIGGER` | `PENDING` | Anchor identity rule. |
| `AXT-005` | `append-only-event-store` | Add previous-event references for correction chains while preserving rejected or errored attempts. | `DEV_AGENT_A` | `BECOMING` | `SUBSEQUENT_CHAIN_CALL` | `PENDING` | Correction chain contract. |
| `AXT-006` | `macro-inference-engine` | Add inference projections for `BlockedByPartial`, `InferredOutdated`, and synchronized `Released`. | `ONTO_CONTROLLER` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | Macro projection query set. |
| `AXT-007` | `shacl-governance` | Add domain isolation checks for Developer, Documentation, QA, Ontology Controller, and Human Reviewer scopes. | `QA_AGENT_A` | `BECOMING` | `EVENT_TRIGGER` | `PENDING` | `DomainIsolationShape`. |
| `AXT-008` | `observability-event-view` | Add axiom evidence columns or filters for `AxiomRef`, `TargetNode`, `ParentAnchor`, `ValidationRule`, and `RecoveryAction`. | `DOC_AGENT_A` | `BECOMING` | `CHAIN_CALL` | `PENDING` | Axiom-aware observability view. |
| `AXT-009` | `lastring-registration` | Require `REGISTER_LASTRING` to reference every satisfied axiom before closing the representation chain. | `ONTO_CONTROLLER` | `BEING` | `LANDSCAPE_MERGE` | `WAITING_HF` | Axiom-complete lastring gate. |

### Per-Axiom Acceptance Criteria

- `AXIOM-001`: Querying by timestamp can reconstruct prior states without freezing unrelated timelines.
- `AXIOM-002`: A Partial-targeted event cannot mutate or directly set Feature/Document status.
- `AXIOM-003`: Static anchor IDs remain stable across simultaneous child transitions.
- `AXIOM-004`: Failed, rejected, corrected, and approved states are all preserved as separate events.
- `AXIOM-005`: Macro status is inferred from dependency events and never written by a micro-agent.
- `AXIOM-006`: Cross-domain mutation attempts are blocked before graph commit and shown in the struggling/validation view.
- `Last-ring`: `REGISTER_LASTRING` remains `WAITING_HF` until all six axiom checks are visible and conforming or explicitly human-accepted.

## Dependency Flow

```text
ontology-domain-model
  -> state-taxonomy
  -> append-only-event-store
  -> shacl-governance
  -> macro-inference-engine
  -> graph-payload-generator
  -> observability-event-view
  -> validation-fixtures
  -> submission-evidence-pack
  -> lastring-registration
  -> axiom-complete-lastring
```

## Lastring Registration Contract

`Lastring` is the terminal lifecycle marker for this representation until a more specific harness definition is supplied.

Minimum fields:

| Field | Requirement |
| --- | --- |
| `@id` | Stable lastring identifier. |
| `sourceArtifact` | Must reference `Ontology representation task list`. |
| `materializedFile` | Must reference this file path. |
| `closedEventChain` | Must reference the validated event chain being closed. |
| `validationResult` | Must be `Passed` or human-accepted warning state. |
| `approvedBy` | Required for `LANDSCAPE_MERGE`. |
| `registeredAt` | Required timestamp. |
| `status` | Starts as `WAITING_HF`; becomes `DONE_HF` after approval. |

Registration is invalid when unresolved `PENDING`, `WAITING`, `ERRORED`, or unaccepted `ONLY_WARNING_TS` validation rows remain.

## ContextChanges

### L1: Files and visible behavior

- Added this codebase file to materialize and extend the session todo artifact.
- Added two mandatory view definitions from the supplied observability and struggling/validation screenshots.
- Added lastring registration tasks and acceptance rules.
- Added an axiom-by-axiom strangling/shackling implementation matrix from the source axiom representations.

### L2: Integration and validation impact

- The original `taskList` remains intact as base context.
- The `extendedTasklist` maps each implementation task to owner, ontology mode, event type, status, and expected output.
- Validation now explicitly covers append-only provenance, SHACL shielding, macro inference, view observability, and lastring closure.
- Each axiom now has a corresponding validation guard, view evidence requirement, and implementation task addition.

### L3: Scope, assumptions, and remaining action

- The harness instruction attachments were used for the FeedForward/ContextChanges format and agent-routing constraints.
- `Lastring` is treated as the final registered lifecycle ring until a stricter project definition is provided.
- Remaining action: implement the graph payload, SHACL rules, inference queries, axiom-aware observability filters, and validation fixtures referenced by this task list.
