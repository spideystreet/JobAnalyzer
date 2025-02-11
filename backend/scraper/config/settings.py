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
    'TITLE': '''Le titre exact du poste.
        URL de l'offre: {url}
        
        RÈGLES TRÈS STRICTES:
        1. TOUJOURS extraire le titre de l'URL ci-dessus (après /job-mission/)
        2. IGNORER COMPLÈTEMENT le contenu de la page
        3. Convertir les tirets en espaces
        4. Appliquer la casse appropriée (majuscules)
        5. Formater les technologies (js -> .js)
        
        ÉTAPES D'EXTRACTION:
        1. Dans l'URL ci-dessus, prendre la partie après /job-mission/
        2. Remplacer les tirets par des espaces
        3. Mettre en majuscule chaque début de mot
        4. Formater les technologies connues (js -> .js)
        
        Exemples:
        Si URL = /job-mission/developpeur-fullstack-javascript-nodejs-reactjs
        ✅ "Développeur Fullstack JavaScript Node.js React.js"
        
        Si URL = /job-mission/data-engineer-python-aws
        ✅ "Data Engineer Python AWS"
        
        Si URL = /job-mission/lead-tech-java-spring
        ✅ "Lead Tech Java Spring"
        
        IMPORTANT: Utiliser UNIQUEMENT l'URL fournie au début de ce prompt''',

    'COMPANY': '''Le nom de l'entreprise qui propose le poste''',

    'COMPANY_TYPE': f'''Un parmi: [{", ".join(type.value for type in CompanyType)}]
        RÈGLES:
        - ESN = SSII, Entreprise de Services Numériques, Société de Conseil
        - Startup = Jeune entreprise innovante, Scale-up
        - Grand Compte = Grande entreprise, Groupe international''',

    'CONTRACT_TYPE': f'''[Liste EXHAUSTIVE des types de contrat mentionnés dans l'offre]
        IMPORTANT:
        1. Chercher TOUS les types de contrat mentionnés dans l'offre
        2. Retourner une liste même s'il n'y a qu'un seul type
        3. Types possibles: [{", ".join(type.value for type in ContractType)}]
        4. Ne pas inclure le mode de travail (télétravail, hybride, etc.)''',

    'DOMAIN': f'''Analyse le domaine d'expertise principal et choisis un parmi: [{", ".join(type.value for type in JobDomain)}]
        RÈGLES STRICTES:
        - Frontend = Développement web côté client (React, Angular, Vue.js...)
        - Backend = Développement serveur (Java, Python, Node.js...)
        - Fullstack = Développement frontend ET backend
        - Data Engineer = Ingénierie des données, ETL, Big Data
        - Data Analyst = Analyse de données, BI, Reporting
        - DevOps = Infrastructure, CI/CD, Cloud
        - Product Manager = Gestion de produit, Product Owner
        - Security = Sécurité informatique, Cybersécurité
        
        Exemples:
        ❌ Incorrect                     ✅ Correct
        "Backend" pour un fullstack     "Fullstack" pour un dev React + Node.js
        "Data Engineer" pour un BI      "Data Analyst" pour un poste de BI
        "DevOps" pour un admin sys      "Backend" pour un admin sys''',

    'XP': f'''Le niveau d'experience requis, choisis un parmi: [{", ".join(type.value for type in ExperienceLevel)}]
        RÈGLES STRICTES :
        Junior = 0-2 ans
        Intermédiaire = 2-5 ans
        Confirmé = 5-10 ans
        Sénior = >10 ans''',

    'REMOTE': f'''Le mode de travail, un parmi: [{", ".join(type.value for type in RemoteType)}]
        RÈGLES:
        - Sur site = 100% présentiel
        - Hybride = Mix présentiel/télétravail
        - 100% = Full remote, télétravail total''',

    'COUNTRY': f'''Le pays où se situe le poste, un parmi: [{", ".join(type.value for type in Country)}]''',

    'REGION': f'''La région où se situe le poste, une parmi: [{", ".join(get_all_regions())}]''',
    
    'TECHNOS': '''[Liste des 5 technologies PRINCIPALES maximum]
        RÈGLES STRICTES:
        1. Maximum 5 technologies les plus importantes
        2. Uniquement les technologies EXPLICITEMENT mentionnées comme requises
        3. Pas de soft skills ou d'outils génériques
        4. Format : ["Techno1", "Techno2", ...]
        5. Utiliser la casse officielle (React, Node.js, etc.)
        
        Exemples de ce qui est attendu:
        ✅ Pour un dev fullstack : ["React", "Node.js", "PostgreSQL"]
        ✅ Pour un data engineer : ["Python", "AWS", "Spark"]
        ✅ Pour un devops : ["Kubernetes", "AWS", "Terraform"]
        
        Exemples de ce qui n'est PAS attendu:
        ❌ ["JIRA", "Git", "Agile", "Anglais"]
        ❌ ["AWS Lambda", "AWS S3", "AWS EC2"] -> utiliser ["AWS"]
        ❌ Plus de 5 technologies
        
        IMPORTANT:
        - Se concentrer sur les technologies PRINCIPALES uniquement
        - Ignorer les outils génériques (JIRA, Git, etc.)
        - Ignorer les soft skills et compétences non techniques
        - Regrouper les technologies similaires (ex: AWS)''',

    'DURATION_DAYS': '''La durée de la mission en jours (NULL si CDI ou non spécifié)
        RÈGLES:
        1. Chercher une mention explicite de durée
        2. Convertir en jours selon ces règles:
           - 1 mois = 30 jours
           - 1 an = 365 jours
        3. Retourner NULL si:
           - CDI
           - Pas de durée mentionnée
           - Durée indéterminée''',

    'TJM_MIN': '''Le TJM minimum en euros (nombre entier uniquement)
        RÈGLES:
        1. Chercher les mentions de tarifs journaliers
        2. Pour les salaires annuels: diviser par 220 jours
        3. Ne garder que le nombre, sans symbole
        4. NULL si pas de TJM trouvé''',

    'TJM_MAX': '''Le TJM maximum en euros (nombre entier uniquement)
        RÈGLES:
        1. Chercher les mentions de tarifs journaliers
        2. Pour les salaires annuels: diviser par 220 jours
        3. Ne garder que le nombre, sans symbole
        4. NULL si pas de TJM trouvé
        5. Si tarif unique, même valeur que TJM_MIN'''
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