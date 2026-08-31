import crypto from 'crypto';
import fs from 'fs';
import { validateIEEEPayload } from './validator.js';

// Simulates an immutable, append-only file database or ledger node
class ImmutableAuditLedger {
    constructor(storagePath = './audit-ledger.log') {
        this.storagePath = storagePath;
    }

    appendLog(entry) {
        const timestamp = new Date().toISOString();
        const record = {
            timestamp,
            entryId: crypto.randomUUID(),
            ...entry
        };
        
        // Calculate hash of current block linked to previous data concepts (Chaining)
        record.hash = crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
        
        // Append synchronously to guarantee immediate absolute write serialization
        fs.appendFileSync(this.storagePath, JSON.stringify(record) + '\n', 'utf8');
        return record.entryId;
    }
}

const ledger = new ImmutableAuditLedger();

export async function processAutonomousEnforcement(incomingJsonLdPayload) {
    const payload = JSON.parse(incomingJsonLdPayload);
    const type = payload["@type"] || payload["type"];
    
    // 1. Resolve matching SHACL profile
    const shapeMap = {
        'ieee:DocumentEditRequest': './shapes/doc-shapes.ttl',
        'ieee:ToolCallRequest': './shapes/tool-shapes.ttl',
        'ieee:VisualEditRequest': './shapes/visual-shapes.ttl'
    };
    
    const shapePath = shapeMap[type];
    if (!shapePath) {
        const errRecord = { action: "REJECT", reason: "UNKNOWN_TYPE", payload };
        ledger.appendLog(errRecord);
        return { status: "REJECTED_UNAUTHORIZED_TYPE" };
    }

    // 2. Execute dynamic validation constraints
    const decision = await validateIEEEPayload({
        dataSource: incomingJsonLdPayload,
        dataFormat: 'jsonld',
        shapeSource: shapePath
    });

    let executionStatus = "PROCEED_TO_AUTOMATED_EXECUTION";
    let activeEscalations = [];

    if (!decision.conforms) {
        // Distinguish between hard Violations and warning-based Escalations
        const hasHardViolations = decision.errors.some(err => err.severity.value.endsWith('Violation'));
        const warnings = decision.errors.filter(err => err.severity.value.endsWith('Warning'));

        if (hasHardViolations) {
            executionStatus = "HARD_REJECTION_ABORT";
        } else if (warnings.length > 0) {
            executionStatus = "ESCALATED_TO_HUMAN_IN_THE_LOOP";
            activeEscalations = warnings.map(w => w.message || "Rule constraint alert.");
        }
    }

    // 3. Log results into the immutable ledger before acting on state changes
    const ledgerEntryId = ledger.appendLog({
        payloadSummary: { type, id: payload["id"] || "anonymous" },
        status: executionStatus,
        validationErrors: decision.errors || [],
        payloadSnapshot: payload
    });

    // 4. Return action metrics to the orchestrator 
    return {
        status: executionStatus,
        ledgerId: ledgerEntryId,
        escalations: activeEscalations,
        payload
    };
}
