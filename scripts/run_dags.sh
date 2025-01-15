#!/bin/bash

# Obtenir la date du jour au format YYYY-MM-DD
TODAY=$(date +%Y-%m-%d)

# Exécuter les DAGs en séquence
docker compose exec airflow-scheduler airflow dags test DATA_PIPELINE.01_JOB_SCRAPING $TODAY && \
docker compose exec airflow-scheduler airflow dags test DATA_PIPELINE.02_JOB_TRANSFO $TODAY && \
docker compose exec airflow-scheduler airflow dags test DATA_PIPELINE.03_JOB_LOAD $TODAY