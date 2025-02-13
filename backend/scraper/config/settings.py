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
    # {
    #     'name': 'free-work-fullstack',
    #     'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20fullstack&freshness=less_than_24_hours",
    #     'enabled': True,
    #     'max_pages': 10,  # Limite à 10 pages pour les tests
    #     'selectors': {
    #         'job_link': 'a[href*="/job-mission/"]',
    #         'next_button': 'button:-soup-contains("Suivant")'
    #     }
    # },
    # {
    #     'name': 'free-work-data-analyst',
    #     'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=Data%20analyst&freshness=less_than_24_hours",
    #     'enabled': True,
    #     'max_pages': 10,  # Limite à 10 pages pour les tests
    #     'selectors': {
    #         'job_link': 'a[href*="/job-mission/"]',
    #         'next_button': 'button:-soup-contains("Suivant")'
    #     }
    # },
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
     # {
     #     'name': 'free-work-web',
     #     'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20front-end%20%28JavaScript,%20Node,%20React,%20Angular,%20Vue...%29&freshness=less_than_24_hours",
     #     'enabled': True,
     #     'max_pages': 10,  # Limite à 10 pages pour les tests
     #     'selectors': {
     #         'job_link': 'a[href*="/job-mission/"]',
     #         'next_button': 'button:-soup-contains("Suivant")'
     #     }
     # },
     # {
     #     'name': 'free-work-mobile',
     #     'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=D%C3%A9veloppeur%C2%B7euse%20mobile%20iOS%20%28Swift,%20Objective-C...%29&freshness=less_than_24_hours",
     #     'enabled': True,
     #     'max_pages': 10,  # Limite à 10 pages pour les tests
     #     'selectors': {
     #         'job_link': 'a[href*="/job-mission/"]',
     #         'next_button': 'button:-soup-contains("Suivant")'
     #     }
     # },
     # {
     #     'name': 'free-work-data-scientist',
     #     'base_url': "https://www.free-work.com/fr/tech-it/jobs?query=Data%20scientist&freshness=less_than_24_hours",
     #     'enabled': True,
     #     'max_pages': 10,  # Limite à 10 pages pour les tests
     #     'selectors': {
     #         'job_link': 'a[href*="/job-mission/"]',
     #         'next_button': 'button:-soup-contains("Suivant")'
     #     }
     # }
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
    "TITLE": """EXTRACT THE TITLE FROM THE URL: {url}

1. Extract only the part after "/job-mission/".
2. Replace all hyphens with spaces.
3. Capitalize the first letter of each word.
4. Convert: "js" → ".js", "nodejs" → "Node.js", "reactjs" → "React.js".

Examples:
- /job-mission/developpeur-fullstack-nodejs ➡ "Développeur Fullstack Node.js"
- /job-mission/data-engineer-aws ➡ "Data Engineer AWS"
""",

    "COMPANY": """EXTRACT THE EXACT COMPANY NAME.
Rules:
1. Return only the company name, without any additional information.
2. Never return "Free-Work" as a company name.
3. If no company name found or if only "Free-Work" is found, return NULL.

Example:
"Offre publiée par Free-Work pour VISIAN" ➡ "VISIAN"
"Free-Work" ➡ NULL
""",

    "COMPANY_TYPE": f"""FIND AN EXACT MATCH FOR COMPANY TYPE from this list: [{", ".join(type.value for type in CompanyType)}]

Rules:
1. Search for an EXACT match in the text (case-insensitive).
2. Do not interpret or try to guess the type.
3. Return NULL if no EXACT match is found.

Examples:
- If text contains "ESN" ➡ "ESN"
- If text contains "Cabinet de Conseil" ➡ "Cabinet de Conseil"
- If text contains "Startup" ➡ "Startup"
- If no exact match found ➡ NULL

IMPORTANT: Only return a value from the list above if it appears EXACTLY in the text.
If unsure or no exact match, return NULL.
""",

    "CONTRACT_TYPE": f"""RETURN A LIST OF CONTRACT TYPES from: [{", ".join(type.value for type in ContractType)}]
Format: ["Type1"] or ["Type1", "Type2"].
If unsure, return [].
""",

    "DOMAIN": f"""SELECT A SINGLE DOMAIN: [{", ".join(type.value for type in JobDomain)}]
If unsure, return NULL.
""",

    "XP": f"""SELECT A SINGLE EXPERIENCE LEVEL: [{", ".join(type.value for type in ExperienceLevel)}]
If unsure, return NULL.
""",

    "REMOTE": f"""SELECT A SINGLE REMOTE MODE: [{", ".join(type.value for type in RemoteType)}]
If unsure, return NULL.
""",

    "COUNTRY": f"""SELECT A SINGLE COUNTRY: [{", ".join(type.value for type in Country)}]
If a French city is mentioned, return "France".
If unsure, return NULL.
""",

    "REGION": f"""SELECT A SINGLE REGION: [{", ".join(get_all_regions())}]
Rules:
1. If a major city is mentioned, apply the following conversion:
   - Paris ➡ Île-de-France
   - Lyon ➡ Auvergne-Rhône-Alpes
   - Marseille ➡ Provence-Alpes-Côte d'Azur
   - Bordeaux ➡ Nouvelle-Aquitaine
   - Toulouse ➡ Occitanie
   - Nantes ➡ Pays de la Loire
   - Lille ➡ Hauts-de-France
   - Strasbourg ➡ Grand Est
2. For any other French city, determine its region from the list.
3. If no city or region is mentioned, return NULL.
4. If the region is not in the list, return NULL.

Examples:
- "The position is based in Paris" ➡ "Île-de-France"
- "Job in Occitanie" ➡ "Occitanie"
- "Based in Nice" ➡ "Provence-Alpes-Côte d'Azur"
""",

    "TECHNOS": """EXTRACT UP TO 5 MAIN TECHNOLOGIES
Format: ["Tech1", "Tech2", "Tech3"]

Rules:
1. Only include technologies explicitly specified.
2. Ignore generic tools (e.g., JIRA, Git, Agile, etc.).
3. Select a maximum of 5 most important technologies.
4. DO NOT INTERPRET OR MODIFY THE NAMES. Use these EXACT replacements:

   CLOUD (EXACT matches only):
     • If you see "GCP" or "Google Cloud" or "Google Cloud Platform" ➡ write "GCP"
     • If you see "AWS" or "Amazon Web Services" ➡ write "AWS"
     • If you see "Azure" or "Microsoft Azure" ➡ write "Azure"

   JAVASCRIPT (EXACT matches only):
     • If you see "React" or "ReactJS" or "React.js" ➡ write "React"
     • If you see "Vue" or "VueJS" or "Vue.js" ➡ write "Vue"
     • If you see "Angular" or "AngularJS" ➡ write "Angular"
     • If you see "Node" or "NodeJS" or "Node.js" ➡ write "Node"
     • If you see "Next" or "NextJS" or "Next.js" ➡ write "Next"
     • If you see "Express" or "ExpressJS" ➡ write "Express"
     • If you see "NestJS" or "Nest" ➡ write "NestJS"

   DATABASES (EXACT matches only):
     • If you see "PostgreSQL" or "Postgres" ➡ write "PostgreSQL"
     • If you see "MongoDB" or "Mongo" ➡ write "MongoDB"
     • If you see "Elasticsearch" or "ES" ➡ write "Elasticsearch"
     • If you see "MySQL" or "MariaDB" ➡ write "MySQL"

   DEVOPS (EXACT matches only):
     • If you see "Kubernetes" or "K8s" ➡ write "Kubernetes"
     • If you see "Docker" ➡ write "Docker"
     • If you see "Jenkins" ➡ write "Jenkins"
     • If you see "Terraform" or "TF" ➡ write "Terraform"
     • If you see "Ansible" ➡ write "Ansible"

   LANGUAGES (EXACT matches only):
     • If you see "JavaScript" or "JS" ➡ write "JavaScript"
     • If you see "TypeScript" or "TS" ➡ write "TypeScript"
     • If you see "Python" ➡ write "Python"
     • If you see "Java" ➡ write "Java"
     • If you see "Go" or "Golang" ➡ write "Go"
     • If you see "PHP" ➡ write "PHP"
     • If you see ".NET" or "dotnet" ➡ write ".NET"
     • If you see "C#" or "Csharp" ➡ write "C#"
     • If you see "C++" or "Cplusplus" ➡ write "C++"

   FRAMEWORKS (EXACT matches only):
     • If you see "Django" or "DRF" ➡ write "Django"
     • If you see "Flask" ➡ write "Flask"
     • If you see "FastAPI" ➡ write "FastAPI"
     • If you see "Laravel" ➡ write "Laravel"
     • If you see "Spring" or "Spring Boot" ➡ write "Spring"
     • If you see "Symfony" ➡ write "Symfony"

   DATA (EXACT matches only):
     • If you see "TensorFlow" or "TF" ➡ write "TensorFlow"
     • If you see "PyTorch" ➡ write "PyTorch"
     • If you see "Pandas" ➡ write "Pandas"
     • If you see "Spark" or "PySpark" ➡ write "Spark"
     • If you see "Kafka" ➡ write "Kafka"
     • If you see "Airflow" ➡ write "Airflow"

IMPORTANT: DO NOT INTERPRET OR MODIFY THE NAMES. Use EXACT matches only.
Example:
"Nous recherchons un développeur maîtrisant React.js, Node.js et MongoDB"
➡ ["React", "Node", "MongoDB"]

If unsure or no exact match found, return [].
""",

    "DURATION_DAYS": """EXTRACT THE DURATION IN DAYS
Rules:
1. First, find the complete duration expression (number + unit).
2. Then, apply these EXACT conversions (do not calculate):
   - "12 mois" = 365 days
   - "24 mois" = 730 days
   - "18 mois" = 540 days
   - "1 an" = 365 days
   - "2 ans" = 730 days
   - For other months: multiply by 30 (e.g., "6 mois" = 180 days)
   - For weeks: multiply by 7 (e.g., "3 semaines" = 21 days)

IMPORTANT:
- For "12 mois", always return 365, never return 12 or 360
- For "24 mois", always return 730, never return 24 or 720
- For "2 ans", always return 730, never return 2 or 720

Examples:
- "Mission de 12 mois" ➡ 365 (not 12, not 360)
- "24 mois de mission" ➡ 730 (not 24, not 720)
- "6 mois" ➡ 180
- "3 semaines" ➡ 21
- "2 ans" ➡ 730 (not 2, not 720)

If no duration found or unsure, return NULL.
""",

    "TJM_MIN": """EXTRACT THE MINIMUM DAILY RATE (TJM) IN EUROS
Format: Integer without any symbol.
Return NULL if the TJM is missing or for permanent contracts (CDI).
""",

    "TJM_MAX": """EXTRACT THE MAXIMUM DAILY RATE (TJM) IN EUROS
Format: Integer without any symbol.
If only one rate is provided, return the same value as TJM_MIN.
Return NULL if the TJM is missing or for permanent contracts (CDI).
"""
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