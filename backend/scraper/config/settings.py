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
    'TITLE': '''Le titre du poste''',

    'COMPANY': '''Le nom de l'entreprise''',

    'COMPANY_TYPE': f'''Un parmi: [{", ".join(type.value for type in CompanyType)}]''',

    'CONTRACT_TYPE': f'''[Liste EXHAUSTIVE des types de contrat mentionnés dans l'offre]
        IMPORTANT:
        1. Chercher TOUS les types de contrat mentionnés dans l'offre, ceux mentionnés à l'intérieur des balises <div class="tags relative w-full">
        2. Retourner une liste même s'il n'y a qu'un seul type
        3. Types possibles: [{", ".join(type.value for type in ContractType)}]''',

    'DOMAIN': f'''Analyse bien le domaine d'expertise qui correspond et choisis un parmi: [{", ".join(type.value for type in JobDomain)}]''',

    'XP': f'''Le niveau d'experience, choisis un parmi: [{", ".join(type.value for type in ExperienceLevel)}]
        RÈGLES STRICTES :
        Junior = <2 ans
        Intermédiaire = 2-5 ans
        Confirmé = 5-10 ans
        Sénior = >10 ans''',

    'REMOTE': f'''Un parmi: [{", ".join(type.value for type in RemoteType)}]''',

    'COUNTRY': f'''Un parmi: [{", ".join(type.value for type in Country)}]''',

    'REGION': f'''Une région parmi: [{", ".join(get_all_regions())}], selon le pays''',
    
    'TECHNOS': f'''[Liste des technologies requises]
        RÈGLES STRICTES de normalisation des technos :
        1. TOUJOURS utiliser la casse officielle de la technologie
        2. Supprimer les numéros de version
        
        Exemples OBLIGATOIRES à suivre :
        ❌ Incorrect         ✅ Correct
        "POWERBI"           "Power BI"
        "JAVASCRIPT"        "JavaScript"
        "ReactJS"           "React"
        "NODEJS"            "Node.js"
        "VueJS"            "Vue.js"
        "PYTHON"           "Python"
        "ANGULAR 14"       "Angular"
        "azure devops"     "Azure DevOps"
        "Aws lambda"       "AWS Lambda"
        
        IMPORTANT : 
        - Exclure les soft skills et compétences non techniques
        - Ne garder que les technologies, frameworks, outils et langages
        - Toujours utiliser la nomenclature officielle de la technologie''',

    'DURATION_DAYS': '''La durée en jours
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
            - X mois = X * 30 jours''',

    'TJM_MIN': '''Le TJM minimum en euros (nombre entier uniquement)
        RÈGLES STRICTES :
        1. Chercher dans le texte les mentions de tarifs journaliers
        2. Convertir les tarifs annuels en TJM (diviser par 220 jours)
        3. Ne garder que le nombre, sans le symbole de monnaie
        4. Si pas de TJM trouvé, retourner NULL
        
        Exemples:
        "400-600€/jour" -> 400
        "500€/j" -> 500
        "entre 600 et 800€/jour" -> 600''',

    'TJM_MAX': '''Le TJM maximum en euros (nombre entier uniquement)
        RÈGLES STRICTES :
        1. Chercher dans le texte les mentions de tarifs journaliers
        2. Convertir les tarifs annuels en TJM (diviser par 220 jours)
        3. Ne garder que le nombre, sans le symbole de monnaie
        4. Si pas de TJM trouvé, retourner NULL
        
        Exemples:
        "400-600€/jour" -> 600
        "500€/j" -> 500 (même valeur que min si tarif unique)
        "entre 600 et 800€/jour" -> 800''',
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