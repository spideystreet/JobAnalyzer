"""
#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🗑️  Nettoyage du cache Redis..."

# Si Redis tourne dans Docker
if docker ps | grep -q redis; then
    echo "📦 Redis trouvé dans Docker"
    if docker exec redis redis-cli FLUSHDB; then
        echo -e "${GREEN}✅ Cache Redis vidé avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors du vidage du cache Redis${NC}"
        exit 1
    fi
else
    # Si Redis tourne localement
    echo "💻 Tentative de connexion à Redis local"
    if redis-cli FLUSHDB; then
        echo -e "${GREEN}✅ Cache Redis vidé avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors du vidage du cache Redis${NC}"
        exit 1
    fi
fi
""" 