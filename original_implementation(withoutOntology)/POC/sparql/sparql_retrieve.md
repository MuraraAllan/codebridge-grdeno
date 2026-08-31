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