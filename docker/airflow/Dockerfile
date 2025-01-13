# Image de base Airflow officielle
FROM apache/airflow:2.7.3-python3.10

USER root

# Installation des dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Création et configuration des dossiers
RUN mkdir -p /opt/airflow/backend && \
    chown -R airflow:root /opt/airflow

USER airflow

# Copie des fichiers du projet
COPY --chown=airflow:root ./backend /opt/airflow/backend
COPY --chown=airflow:root pyproject.toml poetry.lock /opt/airflow/

# Installation des dépendances depuis requirements.txt
COPY requirements.txt /opt/airflow/
RUN pip install --user -r requirements.txt

WORKDIR /opt/airflow

# Configuration du PYTHONPATH pour inclure le dossier parent
ENV PYTHONPATH=/opt/airflow:/opt/airflow/backend 