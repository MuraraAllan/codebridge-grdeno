import { validateIEEEPayload } from './validator.js';

async function processAutonomousEnforcement(incomingJsonLdPayload) {
    const payload = JSON.parse(incomingJsonLdPayload);
    const type = payload["@type"] || payload["type"];
    
    let shapePath = '';
    
    // Dynamic mediator routing
    switch(type) {
        case 'ieee:DocumentEditRequest':
            shapePath = './shapes/doc-shapes.ttl';
            break;
        case 'ieee:ToolCallRequest':
            shapePath = './shapes/tool-shapes.ttl';
            break;
        case 'ieee:VisualEditRequest':
            shapePath = './shapes/visual-shapes.ttl';
            break;
        default:
            throw new Error(`🚫 Security Exception: Unknown autonomous operation type [${type}]`);
    }

    // Run the standard engine validation pass
    const decision = await validateIEEEPayload({
        dataSource: incomingJsonLdPayload, // passed directly as string source
        dataFormat: 'jsonld',
        shapeSource: shapePath // Local targeted rulebook
    });

    if (decision.conforms) {
        // Proceed with trusted autonomous orchestration mapping
        return { status: "PROCEED_TO_EXECUTION", payload };
    } else {
        // Trigger automated remediation / alerting loop
        return { status: "REJECTED_BY_ENFORCEMENT_POLICY", violations: decision.errors };
    }
}
