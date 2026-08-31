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