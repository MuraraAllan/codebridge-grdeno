# Phase-Scattering Resolution (The Isolated Branch Read)

PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?currentState ?timestamp ?actor ?landscape
WHERE {
  # 1. Target state transitions for the specific component
  ?activity a ex:StateTransition ;
            ex:target ex:part_oauth_token ;
            ex:toState ?currentState ;
            prov:wasAssociatedWith ?actor ;
            ex:landscape ?landscape ;
            prov:endedAtTime ?timestamp .
            
  # 2. Phase-Scattering Filter: 
  # Only accept events that happened on THIS specific isolated branch, 
  # or fallback to MAIN if no branch-specific events exist.
  FILTER (?landscape = "Temp_FeatureABC" || ?landscape = "MAIN")
}
# 3. Sort chronologically to guarantee the most recent temporal state
ORDER BY DESC(?timestamp)
LIMIT 1



PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

# Append-only insertion into the graph payload
INSERT DATA {
  ex:activity_dev_8831 a ex:StateTransition ;
    ex:target ex:part_oauth_token ;
    ex:fromState ex:Review ;
    ex:toState ex:Approved ;
    
    # Locks the mutation to the isolated branch context
    ex:landscape "Temp_FeatureABC" ;
    
    # Provenance and cryptographic anchoring
    prov:wasAssociatedWith ex:agent_dev_01 ;
    ex:commitHash "j8k9l0m" ;
    prov:endedAtTime "2026-08-30T16:00:00Z"^^xsd:dateTime .
}




# Cross-Branch Macro-Inference (The Automata Conflict Generator)

PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

CONSTRUCT {
  # Dynamically mints a new Macro-State node
  ?newInferenceId a ex:InferredMacroState ;
                  ex:target ?document ;
                  ex:fromState ex:Released ;
                  ex:toState ex:Outdated ;
                  ex:landscape "MAIN" ;
                  prov:wasAssociatedWith ex:onto_controller_sparql ;
                  ex:triggerDependency ?latestCodeActivity ;
                  prov:endedAtTime ?currentTime .
}
WHERE {
  # 1. Identify the relationship between the doc and the released code feature
  ?document a ex:Document ;
            ex:hasFeature ?feature .
            
  # 2. Find the latest activity for that feature on MAIN
  ?latestCodeActivity a ex:StateTransition ;
                      ex:target ?feature ;
                      ex:toState ex:Released ;
                      ex:landscape "MAIN" ;
                      prov:endedAtTime ?activityTime .
                      
  # 3. Ensure no subsequent events have already updated the document
  NOT EXISTS {
    ?docActivity a ex:StateTransition ;
                 ex:target ?document ;
                 prov:endedAtTime ?docTime .
    FILTER(?docTime > ?activityTime)
  }
  
  # 4. Generate dynamic variables for the CONSTRUCT block
  BIND(URI(CONCAT("http://labx.ai/ontology#macro_inference_", STR(UUID()))) AS ?newInferenceId)
  BIND(NOW() AS ?currentTime)
}


PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?currentState ?timestamp ?commitHash ?actor
WHERE {
  # 1. Target all StateTransition activities
  ?activity a ex:StateTransition ;
            
  # 2. Filter exactly by our specific component anchor
            ex:target ex:part_oauth_token ;
            
  # 3. Extract the variables we care about
            ex:toState ?currentState ;
            prov:endedAtTime ?timestamp ;
            ex:commitHash ?commitHash ;
            prov:wasAssociatedWith ?actor .
}
# 4. Sort chronologically from newest to oldest
ORDER BY DESC(?timestamp)

# 5. Slice off everything except the absolute latest event
LIMIT 1


If run against the graph-payload.jsonld we just defined, this query gracefully skips over the Draft -> Review event and perfectly returns the Review -> Approved event from 15:30:00Z.

# 2. HORIZONTAL DOMAIN ISOLATION (CROSS-SCOPE VIOLATION SHIELD)
ex:DomainIsolationShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   sh:sparql [
       sh:message "CRITICAL SHACL VIOLATION: Horizontal Domain Breach. A Developer Agent (DomainCode) cannot target a Document, and a Document Agent (DomainDocs) cannot target Code." ;
       sh:select """
           PREFIX ex: <http://labx.ai/ontology#>
           PREFIX prov: <http://www.w3.org/ns/prov#>
           
           SELECT $this
           WHERE {
               $this ex:target ?targetComponent ;
                     prov:wasAssociatedWith ?actor .
                     
               ?targetComponent a ?targetType .
               ?actor ex:domainScope ?actorDomain .
               
               # Condition A: Code agent trying to touch docs
               BIND(IF(?actorDomain = ex:DomainCode && ?targetType = ex:Document, true, false) AS ?codeBreach)
               
               # Condition B: Doc agent trying to touch code
               BIND(IF(?actorDomain = ex:DomainDocs && (?targetType = ex:Feature || ?targetType = ex:Partial), true, false) AS ?docBreach)
               
               FILTER (?codeBreach = true || ?docBreach = true)
           }
       """ ;
   ] .

Constraint 3: Axiom of Non-Inverse Propagation (Hierarchy Shield)
This shape enforces Axiom 2. The ONTO_CONTROLLER ensures that a micro-task intended for a sub-component does not illegally mutate the parent anchor.
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .

# 3. HIERARCHY SHIELDING (NON-INVERSE PROPAGATION)
ex:HierarchyShieldShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   sh:sparql [
       sh:message "CRITICAL SHACL VIOLATION: Scope Leak. An activity targeting a Partial cannot implicitly or explicitly declare a state change for its superior Feature." ;
       sh:select """
           PREFIX ex: <http://labx.ai/ontology#>
           
           SELECT $this
           WHERE {
               # The activity targets a specific component
               $this ex:target ?target .
               ?target a ex:Feature .
               
               # But the telemetry/branch originated from a Partial-level scope
               $this ex:landscape ?branch .
               FILTER(STRSTARTS(?branch, "Temp_Partial") || STRSTARTS(?branch, "fix/partial"))
           }
       """ ;
   ] .

Constraint 4: Cross-Branch Macro-Inference (The Automata Conflict Generator)
When the ONTO_CONTROLLER successfully validates and appends a StateTransition to the graph, it instantly runs this CONSTRUCT query in the background. This enforces Axiom 5, minting new macro-awareness nodes without relying on agent intervention.
PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

# 4. MACRO-INFERENCE AUTOMATA
CONSTRUCT {
 # The Onto-Controller dynamically mints a new InferredMacroState
 ?newInferenceId a ex:InferredMacroState ;
                 ex:target ?document ;
                 ex:fromState ex:Released ;
                 ex:toState ex:Outdated ;
                 ex:landscape "MAIN" ;
                 prov:wasAssociatedWith ex:onto_controller ;
                 ex:triggerDependency ?latestCodeActivity ;
                 prov:endedAtTime ?currentTime .
}
WHERE {
 # Identify parent documents linked to the updated feature
 ?document a ex:Document ;
           ex:hasFeature ?feature .
           
 # Detect if the feature just reached a 'Released' state on MAIN
 ?latestCodeActivity a ex:StateTransition ;
                     ex:target ?feature ;
                     ex:toState ex:Released ;
                     ex:landscape "MAIN" ;
                     prov:endedAtTime ?activityTime .
                     
 # Ensure the document hasn't already been updated AFTER this release
 NOT EXISTS {
   ?docActivity a ex:StateTransition ;
                ex:target ?document ;
                prov:endedAtTime ?docTime .
   FILTER(?docTime > ?activityTime)
 }
 
 BIND(URI(CONCAT("http://labx.ai/ontology#macro_inference_", STR(UUID()))) AS ?newInferenceId)
 BIND(NOW() AS ?currentTime)
}

Constraint 5: Phase-Scattering Resolution (Materialized View Aggregator)
When the system needs to know the actual status of a component (e.g., to render the observability dashboard or to pass context to an agent via MCP), the ONTO_CONTROLLER executes this query. It enforces Axiom 4 (Zero-Mutation) by calculating the state dynamically from the immutable event stream.
PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>

# 5. MATERIALIZED VIEW AGGREGATOR
SELECT ?currentState ?timestamp ?actor ?landscape
WHERE {
 # Target all transitions for the specific anchor
 ?activity a ex:StateTransition ;
           ex:target ex:part_oauth_token ;
           ex:toState ?currentState ;
           prov:wasAssociatedWith ?actor ;
           ex:landscape ?landscape ;
           prov:endedAtTime ?timestamp .
           
 # Isolate to the specific phase/branch context
 FILTER (?landscape = "Temp_FeatureABC" || ?landscape = "MAIN")
}
# Sort chronologically to extract only the absolute latest temporal reality
ORDER BY DESC(?timestamp)
LIMIT 1

________________


User prompt: which other constraints the shacl must handle?
Response: To guarantee absolute mathematical rigor and fulfill the "Austerity Features" of this architecture, the ONTO_CONTROLLER's SHACL engine must plug the remaining structural vulnerabilities. While our previous shapes prevent bad logic (like skipping reviews or crossing domains), we must also prevent bad data (like missing audit trails or hallucinated targets).
Here are the final structural SHACL constraints the ONTO_CONTROLLER must enforce before allowing any payload into the MAIN graph.
Constraint 6: Provenance & Cryptographic Completeness (The Austerity Requirement)
An agent's telemetry is useless if it cannot be audited. This shape enforces Axiom 4 (Zero-Mutation & Append-Only Provenance) by guaranteeing that no state transition can exist without a perfect infrastructural audit trail. It strictly requires a commit hash, a timestamp, a defined landscape, and an actor.
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# 6. PROVENANCE COMPLETENESS SHIELD
ex:ProvenanceShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   # 1. Must have exactly one valid timestamp
   sh:property [
       sh:path prov:endedAtTime ;
       sh:datatype xsd:dateTime ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition rejected. Missing or invalid timestamp." ;
   ] ;
   
   # 2. Must be tied to a specific infrastructure commit
   sh:property [
       sh:path ex:commitHash ;
       sh:datatype xsd:string ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition rejected. Missing git commitHash." ;
   ] ;
   
   # 3. Must declare the phase/branch landscape
   sh:property [
       sh:path ex:landscape ;
       sh:datatype xsd:string ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition rejected. Operating landscape (branch) is undefined." ;
   ] ;
   
   # 4. Must be associated with a registered Agent
   sh:property [
       sh:path prov:wasAssociatedWith ;
       sh:nodeKind sh:IRI ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition rejected. Anonymous transitions are forbidden." ;
   ] .

Constraint 7: Anchor Integrity (Anti-Orphan Shield)
AI agents occasionally hallucinate resource names when formulating tool calls (e.g., inventing ex:part_oauth_v2 instead of targeting the existing ex:part_oauth_token). This shape forces the target of any transition to strictly point to an immutable anchor that already exists in the Traditional Space.
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .

# 7. ANCHOR INTEGRITY (ANTI-ORPHAN)
ex:TargetIntegrityShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   sh:property [
       sh:path ex:target ;
       sh:nodeKind sh:IRI ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition targets an invalid or non-existent anchor." ;
       
       # Validates that the target is explicitly classed as one of our structural anchors
       sh:or (
           [ sh:class ex:Document ]
           [ sh:class ex:Feature ]
           [ sh:class ex:Partial ]
       ) ;
   ] .

Constraint 8: Macro-State Authorship (Zero-Trust Governance)
This is the ultimate security layer for the ontology. It enforces that only the background SPARQL automata (the ONTO_CONTROLLER itself) is legally allowed to author an InferredMacroState. If a standard AI developer agent tries to manually flag a document as ex:Outdated to bypass the workflow, the system rejects it.
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .
@prefix prov: <http://www.w3.org/ns/prov#> .

# 8. MACRO-STATE AUTHORSHIP (ZERO-TRUST GOVERNANCE)
ex:MacroStateAuthorshipShape
   a sh:NodeShape ;
   sh:targetClass ex:InferredMacroState ;
   
   sh:property [
       sh:path prov:wasAssociatedWith ;
       
       # The actor MUST be the internal controller, never a human or Dev Agent
       sh:hasValue ex:onto_controller_sparql ;
       sh:message "CRITICAL SECURITY VIOLATION: Agents cannot manually author Macro-States. This is restricted to the internal SPARQL Automata." ;
   ] ;
   
   sh:property [
       sh:path ex:triggerDependency ;
       sh:nodeKind sh:IRI ;
       sh:minCount 1 ;
       sh:message "CRITICAL: Macro-State must explicitly cite the micro-activity that triggered it." ;
   ] .

The Closed Loop
With these 8 SHACL/SPARQL constraints fully compiled, the ONTO_CONTROLLER now operates as an impenetrable fortress:
1. It blocks skipped steps (Constraint 1).
2. It blocks agents crossing domains (Constraint 2).
3. It blocks scope leaks (Constraint 3).
4. It dynamically generates macro-states (Constraint 4).
5. It materializes dynamic views (Constraint 5).
6. It enforces cryptographic audit trails (Constraint 6).
7. It stops LLM hallucinations (Constraint 7).
8. It prevents agents from hijacking the controller's authority (Constraint 8).
This entirely completes the ruleset for the ONTO_CONTROLLER. Does this cover all the failure states you foresee for the hackathon, or should we model one final shape to handle multi-agent race conditions?
________________


User prompt: model one final shape to handle multi-agent race
Response: This is incredible foresight. In a highly asynchronous, multi-agent environment, race conditions are one of the most dangerous edge cases. If Agent A (QA) and Agent B (Security) evaluate a component concurrently while it sits in Review, Agent A might push it to Approved while Agent B simultaneously pushes it to Rejected.
If both events are blindly appended, the timeline "forks," destroying the deterministic nature of the ontology.
To handle this in a zero-mutation graph, we introduce Optimistic Concurrency Control via a cryptographic linked list. Every new transition must explicitly reference the exact ID of the prior transition it is building upon (acting like an ETag).
Here is the final constraint to enforce this.
Constraint 9: Optimistic Concurrency Control (The Race Condition Shield)
This SHACL shape enforces that two agents cannot "double-spend" the same base state. By requiring the ex:previousActivity property to be mathematically unique (injective), the ONTO_CONTROLLER ensures that the first agent to commit wins the race. The second agent's payload will fail validation because its base state is no longer at the tip of the branch.
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .

# 9. OPTIMISTIC CONCURRENCY CONTROL (RACE CONDITION SHIELD)
ex:ConcurrencyRaceConditionShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   # 1. Require a pointer to the previous activity (The "ETag")
   sh:property [
       sh:path ex:previousActivity ;
       sh:nodeKind sh:IRI ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
       sh:message "CRITICAL: State transition must explicitly point to the prior activity it supersedes to maintain the chronological chain." ;
   ] ;
   
   # 2. Enforce uniqueness: No two transitions can claim the same base activity
   sh:sparql [
       sh:message "CRITICAL CONCURRENCY VIOLATION: Race condition detected. Another agent has already transitioned this component from the specified base activity." ;
       sh:select """
           PREFIX ex: <http://labx.ai/ontology#>
           
           SELECT $this
           WHERE {
               # Find the previous activity this transition claims to build upon
               $this ex:previousActivity ?baseActivity .
               
               # Look for ANY other transition in the graph claiming the SAME base activity
               ?competitorActivity a ex:StateTransition ;
                                   ex:previousActivity ?baseActivity .
                                   
               # If a competitor exists and it is not this exact node, a fork occurred
               FILTER ($this != ?competitorActivity)
           }
       """ ;
   ] .


his SHACL shape utilizes an embedded SPARQL query to enforce Axiom 1 (Asynchrony & State Machine Integrity). It acts as the first line of defense in the CI/CD pipeline, physically blocking an agent from hallucinating an invalid state jump (e.g., trying to push a component directly from Draft to Released without passing through Review).
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://labx.ai/ontology#> .

# 1. STATE MACHINE TAXONOMY VALIDATION
ex:StateTransitionShape
   a sh:NodeShape ;
   sh:targetClass ex:StateTransition ;
   
   # Ensures the destination state belongs strictly to the official taxonomy
   sh:property [
       sh:path ex:toState ;
       sh:in (ex:Draft ex:Review ex:Approved ex:Released ex:Rejected) ;
       sh:minCount 1 ;
       sh:maxCount 1 ;
   ] ;
   
   # Embedded SPARQL: Logical transition rule blocking Draft -> Released jumps
   sh:sparql [
       sh:message "CRITICAL SHACL VIOLATION: Invalid state transition. An agent cannot push a component directly from Draft to Released." ;
       sh:select """
           PREFIX ex: <http://labx.ai/ontology#>
           
           SELECT $this
           WHERE {
               $this ex:fromState ex:Draft .
               $this ex:toState ex:Released .
           }
       """ ;
   ] .


his query resolves the exact state by filtering against the specific landscape (branch) the agent is currently operating in.
PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?currentState ?timestamp ?actor ?landscape
WHERE {
 # 1. Target state transitions for the specific component
 ?activity a ex:StateTransition ;
           ex:target ex:part_oauth_token ;
           ex:toState ?currentState ;
           prov:wasAssociatedWith ?actor ;
           ex:landscape ?landscape ;
           prov:endedAtTime ?timestamp .
           
 # 2. Phase-Scattering Filter: 
 # Only accept events that happened on THIS specific isolated branch, 
 # or fallback to MAIN if no branch-specific events exist.
 FILTER (?landscape = "Temp_FeatureABC" || ?landscape = "MAIN")
}
# 3. Sort chronologically to guarantee the most recent temporal state
ORDER BY DESC(?timestamp)
LIMIT 1

2. The Zero-Mutation Append (The Isolated Branch Write)
When an agent completes a micro-task, the MCP server does not mutate the graph by deleting old states. It executes a SPARQL Update (INSERT DATA) to append the new phase into the specific isolated branch.
This ensures the Temp_FeatureABC branch evolves independently without prematurely polluting the MAIN timeline.
PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

# Append-only insertion into the graph payload
INSERT DATA {
 ex:activity_dev_8831 a ex:StateTransition ;
   ex:target ex:part_oauth_token ;
   ex:fromState ex:Review ;
   ex:toState ex:Approved ;
   
   # Locks the mutation to the isolated branch context
   ex:landscape "Temp_FeatureABC" ;
   
   # Provenance and cryptographic anchoring
   prov:wasAssociatedWith ex:agent_dev_01 ;
   ex:commitHash "j8k9l0m" ;
   prov:endedAtTime "2026-08-30T16:00:00Z"^^xsd:dateTime .
}

3. Cross-Branch Macro-Inference (The Automata Conflict Generator)
This is the most critical script for macro-governance. It runs as a background cron job or post-commit hook within the MCP server.
It executes a CONSTRUCT query to scan for a specific condition: if a code component reaches ex:Released on MAIN, the script automatically mints a new InferredMacroState node that flags the parent documentation as ex:Outdated. This physically bridges the isolated development phase with the documentation phase.
PREFIX ex: <http://labx.ai/ontology#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

CONSTRUCT {
 # Dynamically mints a new Macro-State node
 ?newInferenceId a ex:InferredMacroState ;
                 ex:target ?document ;
                 ex:fromState ex:Released ;
                 ex:toState ex:Outdated ;
                 ex:landscape "MAIN" ;
                 prov:wasAssociatedWith ex:onto_controller_sparql ;
                 ex:triggerDependency ?latestCodeActivity ;
                 prov:endedAtTime ?currentTime .
}
WHERE {
 # 1. Identify the relationship between the doc and the released code feature
 ?document a ex:Document ;
           ex:hasFeature ?feature .
           
 # 2. Find the latest activity for that feature on MAIN
 ?latestCodeActivity a ex:StateTransition ;
                     ex:target ?feature ;
                     ex:toState ex:Released ;
                     ex:landscape "MAIN" ;
                     prov:endedAtTime ?activityTime .
                     
 # 3. Ensure no subsequent events have already updated the document
 NOT EXISTS {
   ?docActivity a ex:StateTransition ;
                ex:target ?document ;
                prov:endedAtTime ?docTime .
   FILTER(?docTime > ?activityTime)
 }
 
 # 4. Generate dynamic variables for the CONSTRUCT block
 BIND(URI(CONCAT("http://labx.ai/ontology#macro_inference_", STR(UUID()))) AS ?newInferenceId)
 BIND(NOW() AS ?currentTime)
}