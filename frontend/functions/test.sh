#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:5001/jobanalyzer-191fa/europe-west9/analyze_job"
AUTH_URL="http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key"

# Utilisateur de test (correspond à firebase.json)
TEST_EMAIL="test@test.com"
TEST_PASSWORD="password123"

# URL à tester
TEST_URL="https://www.free-work.com/fr/tech-it/data-engineer/job-mission/senior-data-engineer-azure-power-bi"

echo "🔄 Démarrage du test..."
echo "📍 URL à tester : $TEST_URL"
echo "👤 Utilisateur : $TEST_EMAIL"

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

echo "✅ Authentification réussie"

echo -e "\n🚀 Test de la fonction..."
echo "⏳ Envoi de la requête..."

RESPONSE=$(curl -s -X POST "$API_URL" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d "{
    \"data\": {
        \"url\": \"$TEST_URL\"
    }
}")

echo -e "\n📝 Réponse reçue :"
echo "$RESPONSE" | jq .

echo -e "\n✅ Test terminé" 