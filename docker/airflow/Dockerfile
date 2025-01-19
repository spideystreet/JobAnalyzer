# Image de base Airflow officielle
FROM apache/airflow:2.7.3-python3.10

USER root

# Installation des dépendances système
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
COPY backend/ /opt/airflow/backend/
COPY requirements.txt /opt/airflow/

# Installation des dépendances Python
RUN pip install --no-cache-dir -r /opt/airflow/requirements.txt

WORKDIR /opt/airflow

# Configuration de l'environnement
ENV PYTHONPATH=/opt/airflow 