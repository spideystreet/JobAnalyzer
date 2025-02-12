"""
Configuration centralisée pour le scraper.
"""

import os
from typing import Dict, List
from dotenv import load_dotenv
import sys
from mistralai import Mistral

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
         'name': 'free-work-data-analyst',
         'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=Data%20analyst&freshness=less_than_24_hours",
         'enabled': True,
         'max_pages': 10,  # Limite à 10 pages pour les tests
         'selectors': {
             'job_link': 'a[href*="/job-mission/"]',
             'next_button': 'button:-soup-contains("Suivant")'
         }
     },
     {
         'name': 'free-work-data-engineer',
         'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=Data%20engineer&freshness=less_than_24_hours",
         'enabled': True,
         'max_pages': 10,  # Limite à 10 pages pour les tests
         'selectors': {
             'job_link': 'a[href*="/job-mission/"]',
             'next_button': 'button:-soup-contains("Suivant")'
         }
     },
     {
         'name': 'free-work-web',
         'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20front-end%20%28JavaScript,%20Node,%20React,%20Angular,%20Vue...%29&freshness=less_than_24_hours",
         'enabled': True,
         'max_pages': 10,  # Limite à 10 pages pour les tests
         'selectors': {
             'job_link': 'a[href*="/job-mission/"]',
             'next_button': 'button:-soup-contains("Suivant")'
         }
     },
     {
         'name': 'free-work-mobile',
         'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20mobile%20iOS%20%28Swift,%20Objective-C...%29&freshness=less_than_24_hours",
         'enabled': True,
         'max_pages': 10,  # Limite à 10 pages pour les tests
         'selectors': {
             'job_link': 'a[href*="/job-mission/"]',
             'next_button': 'button:-soup-contains("Suivant")'
         }
     },
    {
        'name': 'free-work-data-scientist',
        'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=Data%20scientist&freshness=less_than_24_hours",
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

# Configuration de l'API Mistral
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_MODEL = "ministral-3b-latest"  # Le modèle par défaut
MISTRAL_BASE_URL = "https://api.mistral.ai/v1"

# Configuration du prompt
REQUIRED_FIELDS = {
    'TITLE': '''EXTRAIRE LE TITRE DEPUIS L'URL: {url}

        ÉTAPES:
        1. Prendre UNIQUEMENT la partie après /job-mission/
        2. Remplacer les tirets par des espaces
        3. Majuscule à chaque début de mot
        4. js -> .js, nodejs -> Node.js, reactjs -> React.js

        EXEMPLES:
        /job-mission/developpeur-fullstack-nodejs ➡️ "Développeur Fullstack Node.js"
        /job-mission/data-engineer-aws ➡️ "Data Engineer AWS"''',

    'COMPANY': '''EXTRAIRE LE NOM DE L'ENTREPRISE
        
        FORMAT: Nom exact sans autre information''',

    'COMPANY_TYPE': f'''CHOISIR UN SEUL TYPE: [{", ".join(type.value for type in CompanyType)}]
        
        SI PAS SÛR ➡️ NULL''',

    'CONTRACT_TYPE': f'''RETOURNER UNE LISTE PARMI: [{", ".join(type.value for type in ContractType)}]
        
        FORMAT: ["Type1"] ou ["Type1", "Type2"]
        SI PAS SÛR ➡️ []''',

    'DOMAIN': f'''CHOISIR UN SEUL DOMAINE: [{", ".join(type.value for type in JobDomain)}]
        
        SI PAS SÛR ➡️ NULL''',

    'XP': f'''CHOISIR UN SEUL NIVEAU: [{", ".join(type.value for type in ExperienceLevel)}]
        
        SI PAS SÛR ➡️ NULL''',

    'REMOTE': f'''CHOISIR UN SEUL MODE: [{", ".join(type.value for type in RemoteType)}]
        
        SI PAS SÛR ➡️ NULL''',

    'COUNTRY': f'''CHOISIR UN SEUL PAYS: [{", ".join(type.value for type in Country)}]
        
        SI VILLE FRANÇAISE CITÉE ➡️ "France"
        SI PAS SÛR ➡️ NULL''',

    'REGION': f'''CHOISIR UNE SEULE RÉGION: [{", ".join(get_all_regions())}]

        CONVERSION OBLIGATOIRE:
        Paris ➡️ Île-de-France
        Lyon ➡️ Auvergne-Rhône-Alpes
        Marseille ➡️ Provence-Alpes-Côte d'Azur
        Bordeaux ➡️ Nouvelle-Aquitaine
        Toulouse ➡️ Occitanie
        Nantes ➡️ Pays de la Loire
        Lille ➡️ Hauts-de-France
        Strasbourg ➡️ Grand Est

        SI PAS DANS LA LISTE ➡️ NULL''',

    'TECHNOS': '''EXTRAIRE MAX 5 TECHNOLOGIES PRINCIPALES

        FORMAT: ["Tech1", "Tech2", "Tech3"]

        RÈGLES:
        - Uniquement technologies EXPLICITES
        - Pas de JIRA/Git/Agile/etc.
        - Regrouper AWS/GCP/Azure
        - Casse exacte: React, Node.js, Vue.js

        SI PAS SÛR ➡️ []''',

    'DURATION_DAYS': '''EXTRAIRE LA DURÉE EN JOURS

        RÈGLES IMPORTANTES:
        1. TOUJOURS chercher l'expression COMPLÈTE de la durée (nombre + unité)
        2. NE JAMAIS s'arrêter au nombre seul
        3. TOUJOURS identifier l'unité (mois, années, semaines)
        4. Ensuite, après la conversion seulement, on gardera le nombre entier

        EXEMPLES D'EXPRESSIONS COMPLÈTES:
        "12 mois" ➡️ 365 jours (pas juste "12")
        "1 an" ➡️ 365 jours (pas juste "1")
        "6 mois" ➡️ 180 jours (pas juste "6")
        "3 semaines" ➡️ 21 jours (pas juste "3")

        FORMULES DE CONVERSION:
        1 semaine = 7 jours
        1 mois = 30 jours
        12 mois = 365 jours (ATTENTION: cas spécial!)
        1 an = 365 jours
        18 mois = 540 jours (cas spécial)
        24 mois = 730 jours (cas spécial)

        EXEMPLES DÉTAILLÉS:
        ✅ "Mission de 12 mois" ➡️ 365
        ✅ "Durée : 6 mois" ➡️ 180
        ✅ "18 mois de mission" ➡️ 540
        ✅ "3 semaines" ➡️ 21
        ✅ "1 an" ➡️ 365
        ✅ "2 ans" ➡️ 730

        ❌ "12" seul ➡️ NULL (pas d'unité!)
        ❌ "Mission longue durée" ➡️ NULL
        ❌ "CDI" ➡️ NULL
        ❌ "Pas de durée spécifiée" ➡️ NULL

        FORMAT: Nombre entier uniquement
        SI PAS D'UNITÉ OU PAS DE DURÉE PRÉCISE ➡️ NULL''',

    'TJM_MIN': '''EXTRAIRE LE TJM MINIMUM EN EUROS

        FORMAT: Nombre entier sans symbole
        SI PAS DE TJM ➡️ NULL
        SI CDI ➡️ NULL''',

    'TJM_MAX': '''EXTRAIRE LE TJM MAXIMUM EN EUROS

        FORMAT: Nombre entier sans symbole
        SI UN SEUL TJM ➡️ Même valeur que TJM_MIN
        SI PAS DE TJM ➡️ NULL
        SI CDI ➡️ NULL''',
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