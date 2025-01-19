#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Obtenir la date du jour au format YYYY-MM-DD
TODAY=$(date +%Y-%m-%d)

echo -e "${GREEN}🚀 Lancement du pipeline...${NC}"

# Activer le DAG
docker compose exec airflow-scheduler airflow dags unpause DATA_PIPELINE.JOB_PIPELINE

# Exécuter le DAG
docker compose exec airflow-scheduler airflow dags trigger DATA_PIPELINE.JOB_PIPELINE

echo -e "${GREEN}📊 Pipeline déclenché ! Affichage des logs...${NC}"

# Suivre les logs en direct
docker compose logs -f airflow-scheduler