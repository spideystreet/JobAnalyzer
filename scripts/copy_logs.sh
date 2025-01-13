#!/bin/bash

# Crée le dossier de logs s'il n'existe pas
mkdir -p backend/airflow/logs/app_logs

# Copie les logs du conteneur vers l'hôte
docker compose cp airflow-scheduler:/opt/airflow/logs/transform_detailed_*.log backend/airflow/logs/app_logs/

# Ajuste les permissions
chmod 644 backend/airflow/logs/app_logs/*.log 