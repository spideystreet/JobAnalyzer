"""
Configuration centralisée pour le scraper.
"""

import os
from typing import Dict, List
from dotenv import load_dotenv
import sys

from ..core.enums import (
    CompanyType, ContractType, JobDomain, RemoteType, Country,
    ExperienceLevel, get_all_regions
)

# Chargement des variables d'environnement
load_dotenv()

# Configuration du scraping de liste
SCRAPING_SOURCES = [
    {
        'name': 'free-work-fullstack',
        'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20fullstack&freshness=less_than_24_hours",
        'enabled': True,
        'max_pages': 10,  # Limite à 10 pages pour les tests
        'selectors': {
            'job_link': 'a[href*="/job-mission/"]',
            'next_button': 'button:-soup-contains("Suivant")'
        }
    },
    {
        'name': 'free-work-data',
        'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20data&freshness=less_than_24_hours",
        'enabled': True,
        'max_pages': 10,  # Limite à 10 pages pour les tests
        'selectors': {
            'job_link': 'a[href*="/job-mission/"]',
            'next_button': 'button:-soup-contains("Suivant")'
        }
    }
]

REQUEST_DELAY = 2  # secondes entre chaque requête
MAX_RETRIES = 3
RETRY_DELAY = 5  # secondes

# Configuration DeepSeek
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')
DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1/chat/completions'
DEEPSEEK_MODEL = 'deepseek-chat'

# Configuration du prompt
REQUIRED_FIELDS = {
    'TITLE': 'Le titre du poste',
    'COMPANY': 'Le nom de l\'entreprise',
    'COMPANY_TYPE': f'Un parmi: [{", ".join(CompanyType._member_names_)}]',
    'CONTRACT_TYPE': f'Un parmi: [{", ".join(ContractType._member_names_)}]',
    'DOMAIN': f'Analyse bien le domaine et choisis un parmi: [{", ".join(JobDomain._member_names_)}]',
    'XP': f'Le niveau d\'experience, choisis un parmi: [{", ".join(ExperienceLevel._member_names_)}] sachant que Junior = <2 ans, Intermédiaire = 2-5 ans, Confirmé = 5-10 ans, Sénior = >10 ans',
    'REMOTE': f'Un parmi: [{", ".join(RemoteType._member_names_)}]',
    'COUNTRY': f'Un parmi: [{", ".join(Country._member_names_)}]',
    'REGION': f'Une région parmi: [{", ".join(get_all_regions())}], selon le pays',
    'TECHNOS': '[Liste des technologies requises] (technos/outils uniquement pas soft-skills ou autres)',
    'DURATION_DAYS': '''La durée en jours (None si le CONTRACT_TYPE est strictement égal à CDI)
            EXEMPLE 1 (Années):
            CDI
            Freelance
            3 ans                    <-- 1095 jours (3 * 365)
            37k-45k €/an
            5 à 10 ans d'expérience

            EXEMPLE 2 (Mois):
            Freelance
            6 mois                   <-- 180 jours (6 * 30)
            37k-45k €/an
            2 à 5 ans d'expérience

            EXEMPLE 3 (Une année):
            CDI
            Freelance
            1 an                     <-- 365 jours (1 * 365)
            37k-45k €/an
            0 à 2 ans d'expérience

            EXEMPLE 4 (Plusieurs mois):
            Freelance
            18 mois                  <-- 540 jours (18 * 30)
            37k-45k €/an
            2 à 5 ans d'expérience

            EXEMPLE 5 (Deux ans):
            CDI
            Freelance
            2 ans                    <-- 730 jours (2 * 365)
            37k-45k €/an
            2 à 5 ans d'expérience

            IMPORTANT: Le nombre que tu cherches apparaît TOUJOURS sur une ligne seule,
            juste après le type de contrat (CDI/Freelance) et avant le salaire.
            C'est TOUJOURS à cet endroit dans le texte !

            RAPPEL DES CALCULS:
            - X ans ou X année(s) = X * 365 jours
            - X mois = X * 30 jours'''
            }

# Configuration du nettoyage HTML
ALLOWED_TAGS = [
    'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br'
]

RELEVANT_CLASSES = [
    'text-2xl font-bold',  # Titre
    'html-renderer prose-content',  # Description
    'flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6'  # Infos entreprise
]

# Configuration HTTP
HTTP_TIMEOUT = 30  # secondes
MAX_RETRIES = 3
RETRY_DELAY = 5  # secondes

# Configuration du logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FORMAT = "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan> | <level>{message}</level>"

# Chemins des logs
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "scraper.log")

# Configuration des logs
LOG_CONFIG = {
    "console": {
        "sink": sys.stdout,
        "level": LOG_LEVEL,
        "colorize": True,
        "format": LOG_FORMAT
    },
    "file": {
        "sink": LOG_FILE,
        "level": "DEBUG",
        "rotation": "48 hours",
        "retention": "1 week",
        "compression": "zip",
        "backtrace": True,
        "diagnose": True,
        "format": LOG_FORMAT,
        "enqueue": True,
        "encoding": "utf-8",
        "mode": "a"
    }
}

# Format personnalisé pour l'affichage des résultats d'analyse
ANALYSIS_LOG_FORMAT = """🔍 Résultats de l'analyse:
TITLE: {TITLE}
COMPANY: {COMPANY}
COMPANY_TYPE: {COMPANY_TYPE}
CONTRACT_TYPE: {CONTRACT_TYPE}
DOMAIN: {DOMAIN}
XP: {XP}
REMOTE: {REMOTE}
COUNTRY: {COUNTRY}
REGION: {REGION}
DURATION_DAYS: {DURATION_DAYS}
TECHNOS: {TECHNOS}
URL: {url}

📊 Stats nettoyage: {original_size:,} → {cleaned_size:,} chars | {scripts_removed} scripts supprimés"""

# Configuration du cache Redis
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')  # Nom du service dans docker-compose
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))
CACHE_TTL = 48 * 3600  # 48 heures

# Configuration Docker
DOCKER_IMAGE = 'job-analyzer-scraper'
DOCKER_TAG = 'latest'

# Configuration Airflow
AIRFLOW_DAG_ID = 'job_scraper'
SCRAPING_INTERVAL = '@daily'  # Exécution quotidienne 