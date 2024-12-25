#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:5001/jobanalyzer-191fa/europe-west9/analyze_job"
AUTH_URL="http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key"
TEST_EMAIL="test@test.com"
TEST_PASSWORD="password123"
TEST_URL="https://www.free-work.com/fr/tech-it/missions/lead-developer-fullstack-nodejs-react-f-h-01hqjw5q8qz9"

echo "🔑 Obtention du token..."
TOKEN=$(curl -s -X POST "$AUTH_URL" \
-H "Content-Type: application/json" \
-d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"returnSecureToken\": true
}" | jq -r '.idToken')

echo "🚀 Test de la fonction..."
curl -s -X POST "$API_URL" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d "{
    \"data\": {
        \"url\": \"$TEST_URL\"
    }
}" | jq .

echo -e "\n✅ Test terminé" 