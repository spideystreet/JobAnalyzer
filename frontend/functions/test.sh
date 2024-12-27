#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:5001/jobanalyzer-191fa/europe-west9/analyze_job"
AUTH_URL="http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key"

# Utilisateur de test
TEST_EMAIL="test@test.com"
TEST_PASSWORD="password123"

# URLs à tester
declare -a TEST_URLS=(
    "https://www.free-work.com/fr/tech-it/data-analyst/job-mission/data-analyst-h-f-power-bi"
    "https://www.free-work.com/fr/tech-it/lead-developer/job-mission/tech-lead-data-55"
)

echo "🔄 Démarrage des tests..."

# Authentification
echo -e "\n🔑 Connexion de l'utilisateur de test..."
TOKEN=$(curl -s -X POST "$AUTH_URL" \
-H "Content-Type: application/json" \
-d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"returnSecureToken\": true
}" | jq -r '.idToken')

if [ "$TOKEN" == "null" ]; then
    echo "❌ Erreur d'authentification"
    exit 1
fi

echo "����� Authentification réussie"

# Tester chaque URL
for url in "${TEST_URLS[@]}"
do
    echo -e "\n\n🎯 Test de l'URL : $url"
    echo "⏳ Envoi de la requête..."

    RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"data\": {
            \"url\": \"$url\"
        }
    }")

    echo -e "\n📝 Réponse brute reçue :"
    echo "$RESPONSE"

    if echo "$RESPONSE" | jq . >/dev/null 2>&1; then
        echo -e "\n📊 Réponse JSON valide :"
        echo "$RESPONSE" | jq .
        
        echo -e "\n🔍 Données transformées :"
        echo "$RESPONSE" | jq .result.data
        
        DOC_ID=$(echo "$RESPONSE" | jq -r .result.doc_id)
        if [ "$DOC_ID" != "null" ]; then
            echo -e "\n💾 Document Firestore créé/mis à jour : $DOC_ID"
        else
            echo -e "\n❌ Erreur : Document non sauvegardé"
        fi
    else
        echo -e "\n❌ Erreur : Réponse non JSON"
        echo "$RESPONSE"
    fi

    echo -e "\n--------------------------------"
done

echo -e "\n✅ Tous les tests sont terminés" 