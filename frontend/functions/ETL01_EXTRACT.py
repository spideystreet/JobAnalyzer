import os
from openai import OpenAI
import logging
from playwright.sync_api import sync_playwright
import json

logger = logging.getLogger(__name__)

class JobExtractor:
    def __init__(self):
        logger.debug("Initializing JobExtractor")
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def extract(self, url: str) -> dict:
        """Extrait et analyse une offre d'emploi."""
        try:
            logger.debug(f"🌐 Extraction de l'URL : {url}")
            
            # Initialiser Playwright pour chaque extraction
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(headless=True)
                context = browser.new_context()
                page = context.new_page()
                
                # Navigation avec attente explicite
                page.goto(url, wait_until="networkidle", timeout=30000)
                page.wait_for_selector('body', state='visible')
                page.wait_for_timeout(2000)
                
                # Extraire le texte
                page_text = page.evaluate('() => document.body.innerText')
                
                # Nettoyer
                page.close()
                context.close()
                browser.close()
                
                # Analyser avec GPT
                prompt = """
                Analyse cette offre d'emploi et retourne un JSON avec EXACTEMENT cette structure.
                IMPORTANT: Ta réponse doit être un JSON valide, sans texte additionnel ni commentaires.
                Si une information n'est pas trouvée, mets une chaîne vide "" ou un tableau vide [] selon le type.

                {
                    "TITLE": "",
                    "COUNTRY": "",
                    "REGION": "",
                    "CITY": "",
                    "COMPANY": "",
                    "COMPANY_TYPE": "",
                    "CONTRACT_TYPE": [],
                    "EXPERIENCE_MIN": "",
                    "EXPERIENCE_MAX": "",
                    "DAILY_MIN": "",
                    "DAILY_MAX": "",
                    "REMOTE": "",
                    "TECHNOS": [],
                    "DURATION_DAYS": "",
                    "URL": ""
                }

                Instructions pour remplir chaque champ :
                - TITLE: le titre de l'offre d'emploi / le poste recherché.
                - COUNTRY: le pays de l'offre d'emploi.
                    Par exemple, "France"
                    Par exemple, "Belgique"
                    Par exemple, "Suisse"
                    Par exemple, "Allemagne"
                    Par exemple, "Italie"
                    Par exemple, "Espagne"
                    Par exemple, "Portugal"
                    Par exemple, "Pologne"
                    Par exemple, "République Tchèque"
                    Par exemple, "Hongrie"
                - REGION: la région de l'offre d'emploi.
                    Par exemple, "Île-de-France"
                    Par exemple, "Provence-Alpes-Côte d'Azur"
                    Par exemple, "Occitanie"
                    Par exemple, "Nouvelle-Aquitaine"
                    Par exemple, "Hauts-de-France"
                    Par exemple, "Grand Est"
                    Par exemple, "Bourgogne-Franche-Comté"
                    Par exemple, "Centre-Val de Loire"
                    Par exemple, "Bretagne"
                    Par exemple, "Pays de la Loire"
                - CITY: la ville de l'offre d'emploi.
                    Par exemple, "Paris"
                    Par exemple, "Lyon"
                    Par exemple, "Marseille"
                    Par exemple, "Toulouse"
                    Par exemple, "Nice"
                    Par exemple, "Bordeaux"
                    Par exemple, "Lille"
                    Par exemple, "Strasbourg"
                - COMPANY: le nom de l'entreprise.
                - COMPANY_TYPE: choisis UNE option parmi ["ESN", "Startup", "Grand Compte", "Cabinet de Conseil", "Cabinet de recrutement / placement", "DSI"]
                - CONTRACT_TYPE: choisis UNE option parmi ["CDI", "CDD", "Freelance"]
                - EXPERIENCE_MIN: le nombre minimum d'années d'expérience requise.
                    Par exemple, si l'offre demande "1 à 3 ans d'expérience", EXPERIENCE_MIN = 1.
                    Par exemple, si l'offre demande "3 à 5 ans d'expérience", EXPERIENCE_MIN = 3.
                    Par exemple, si l'offre demande "5 ans ou plus d'expérience", EXPERIENCE_MIN = 5.
                    Par exemple, si l'offre demande "Aucune expérience requise", EXPERIENCE_MIN = 0.
                - EXPERIENCE_MAX: le nombre maximum d'années d'expérience requise.
                    Par exemple, si l'offre demande "1 à 3 ans d'expérience", EXPERIENCE_MAX = 3.
                    Par exemple, si l'offre demande "3 à 5 ans d'expérience", EXPERIENCE_MAX = 5.
                    Par exemple, si l'offre demande "5 ans ou plus d'expérience", EXPERIENCE_MAX = .
                    Par exemple, si l'offre demande "Aucune expérience requise", EXPERIENCE_MAX = .
                - DAILY_MIN: le salaire minimum par jour.
                    Par exemple, 500-800 €⁄j DAILY_MIN = 500.
                    Par exemple, 800-850 €⁄j DAILY_MIN = 800.
                    Par exemple, 850-900 €⁄j DAILY_MIN = 850.
                    Par exemple, 900-950 €⁄j DAILY_MIN = 900.
                    Par exemple, 950-1000 €⁄j DAILY_MIN = 950.
                    Par exemple, 750-755 €⁄j DAILY_MIN = 750.
                    Par exemple, 755-800 €⁄j DAILY_MIN = 755.
                    Par exemple, 800-850 €⁄j DAILY_MIN = 800.
                    Par exemple, 850-900 €⁄j DAILY_MIN = 850.
                    Par exemple, 950-1000 €⁄j DAILY_MIN = 950.
                - DAILY_MAX: le salaire maximum par jour.
                    Par exemple, 500-800 €⁄j DAILY_MAX = 800.
                    Par exemple, 800-850 €⁄j DAILY_MAX = 850.
                    Par exemple, 850-900 €⁄j DAILY_MAX = 900.
                    Par exemple, 650-900 €⁄j DAILY_MAX = 900.
                    Par exemple, 700-1000 €⁄j DAILY_MAX = 1000.
                    Par exemple, 750-755 €⁄j DAILY_MAX = 755.
                    Par exemple, 755-800 €⁄j DAILY_MAX = 800.
                    Par exemple, 800-850 €⁄j DAILY_MAX = 850.
                    Par exemple, 850-900 €⁄j DAILY_MAX = 900.
                    Par exemple, 950-1000 €⁄j DAILY_MAX = 1000.
                - REMOTE: IMPORTANT - Tu DOIS choisir EXACTEMENT une de ces trois valeurs : "Hybride", "Full-Remote", ou "On-Site"
                    Si tu vois :
                    - "Télétravail partiel" => utilise "Hybride"
                    - "Télétravail 100%" => utilise "Full-Remote"
                    - "Sur site" ou si tu ne vois rien rien => utilise "On-Site"
                     Ne jamais utiliser d'autres valeurs que ces trois options exactes.
                - TECHNOS: liste des technologies primaires requises.
                    Par exemple, ["Python", "JavaScript", "React", "Node.js", "Docker", "Kubernetes", "AWS"]
                    Par exemple, ["Power BI", "SQL", "Excel"]
                    Par exemple, ["Spark", "Hadoop", "Airflow"]
                - DURATION_DAYS: calcule selon ces règles :
                    * X ans ou X année(s) = X * 365 jours
                    * X mois = X * 30 jours
                    * Le nombre apparaît toujours après le type de contrat et avant le salaire
                    Par exemple 2 mois = 60 jours.
                    Par exemple, 6 mois = 180 jours.
                    Par exemple, 8 mois = 240 jours.
                    Par exemple, 12 mois = 365 jours.
                    Par exemple, 1 an = 365 jours.
                    Par exemple, 1 an et 6 mois = 485 jours.
                    Par exemple, 2 ans = 730 jours.
                    Par exemple, 3 ans = 1095 jours.
                    Par exemple, 4 ans = 1460 jours.
                    Par exemple, 5 ans = 1825 jours.
                    Par exemple, 6 ans = 2190 jours.
                    Par exemple, 7 ans = 2555 jours.
                    Par exemple, 8 ans = 2920 jours.
                    Par exemple, 9 ans = 3285 jours.
                    Par exemple, 10 ans = 3650 jours.
                - URL: l'URL de l'offre d'emploi.

                Voici l'offre à analyser :
                {page_text}
                """
                
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    temperature=0.1,
                    messages=[{
                        "role": "system",
                        "content": "Tu es un expert en analyse d'offres d'emploi. Tu réponds UNIQUEMENT en JSON valide."
                    }, {
                        "role": "user",
                        "content": prompt + "\n\n" + page_text
                    }]
                )
                
                # Parser la réponse
                analysis = json.loads(response.choices[0].message.content)
                analysis["URL"] = url
                
                logger.debug(f"✅ Analyse terminée : {json.dumps(analysis, indent=2)}")
                return analysis
                
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return {"error": str(e)} 