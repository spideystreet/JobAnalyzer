import asyncio
import aiohttp
import os
from bs4 import BeautifulSoup
from loguru import logger
from typing import Dict, Any
import json
from openai import OpenAI
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration du client OpenAI pour DeepSeek
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

def clean_html(soup: BeautifulSoup) -> str:
    """Nettoie et extrait les parties pertinentes du HTML."""
    # Calculer la taille originale
    original_html = str(soup)
    original_size = len(original_html)
    logger.info(f"Taille du HTML original : {original_size} caractères")
    
    # Analyser la structure
    logger.info("Structure de la page :")
    for tag in soup.find_all(['div', 'section']):
        if tag.get('class'):
            logger.info(f"Balise trouvée : {tag.name} - Classes : {tag.get('class')}")
    
    # Pour l'instant, retourner tout le HTML sans les scripts et styles
    for element in soup.find_all(['script', 'style']):
        element.decompose()
    
    cleaned_html = str(soup)
    logger.info(f"Taille du HTML nettoyé : {len(cleaned_html)} caractères")
    
    # Debug: afficher un extrait du HTML nettoyé
    logger.debug(f"Extrait du HTML nettoyé (premiers 500 caractères) :\n{cleaned_html[:500]}")
    
    return cleaned_html

async def analyze_with_ai(cleaned_html: str) -> Dict[str, Any]:
    """Analyse le contenu HTML avec DeepSeek pour extraire les informations structurées."""
    prompt = f"""Analyse cette offre d'emploi et extrait les informations suivantes au format JSON.
Utilise UNIQUEMENT les informations présentes dans le texte, ne fais pas de suppositions.
Si une information n'est pas disponible, laisse la vide.
IMPORTANT: Assure-toi que ta réponse soit un JSON strictement valide, sans texte additionnel ni commentaires.

Format attendu:
{{
    "TITLE": "Titre du poste",
    "COUNTRY": "Pays de la mission",
    "REGION": "Région ou département de la mission",
    "CITY": "Ville de la mission",
    "COMPANY": "Nom de l'entreprise",
    "COMPANY_TYPE": "Un parmi: [ESN, Startup, Grand Compte, Cabinet de Conseil, Scale-up, Cabinet de recrutement]",
    "CONTRACT_TYPE": "Un parmi: [Freelance, CDI, CDD, Stage, Alternance]",
    "EXPERIENCE_MIN": "Nombre d'années minimum (0-10)",
    "EXPERIENCE_MAX": "Nombre d'années maximum",
    "TJM_MIN": "TJM minimum (nombre uniquement)",
    "TJM_MAX": "TJM maximum (nombre uniquement)",
    "TVTRAVAIL": "Un parmi: [Hybride, Full-Remote, On-Site]",
    "TECHNOS": ["Liste", "des", "technos", "requises"],
    "DURATION_DAYS": "Durée en jours calculée selon les règles suivantes:"
}}

Règles pour DURATION_DAYS:
- X ans ou X année(s) = X * 365 jours
- X mois = X * 30 jours
- La durée est toujours mentionnée sur une ligne seule après le type de contrat et avant le salaire

Contenu HTML à analyser:
{cleaned_html}"""

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "Tu es un assistant spécialisé dans l'analyse d'offres d'emploi. Tu extrais les informations pertinentes et les retournes au format JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            stream=False
        )
        
        result = response.choices[0].message.content
        # Nettoyer la réponse des backticks et identifiants markdown
        result = result.replace('```json', '').replace('```', '').strip()
        logger.debug(f"Réponse brute de l'IA :\n{result}")  # Debug: voir la réponse avant parsing JSON
        return json.loads(result)
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse IA : {str(e)}")
        return {
            "error": str(e),
            "title": None,
            "company": None,
            "description": None,
            "skills": [],
            "tjm_min": None,
            "tjm_max": None,
            "city": None,
            "remote": None
        }

async def analyze_page_structure():
    url = "https://www.free-work.com/fr/tech-it/developpeur-fonctionnel/job-mission/data-engineer-spark-scala-databricks-1"
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    html = await response.text()
                    
                    # 1. Parser le HTML
                    soup = BeautifulSoup(html, 'html.parser')
                    logger.info("Structure HTML récupérée")
                    
                    # 2. Nettoyer et extraire les parties pertinentes
                    cleaned_html = clean_html(soup)
                    
                    # 3. Analyse avec l'IA
                    logger.info("Analyse de l'offre avec DeepSeek...")
                    job_data = await analyze_with_ai(cleaned_html)
                    
                    # 4. Affichage des résultats
                    logger.info("\nRésultats de l'analyse IA :")
                    logger.info(json.dumps(job_data, indent=2, ensure_ascii=False))
                    
                else:
                    logger.error(f"Erreur lors de l'accès à la page : {response.status}")
                    
        except Exception as e:
            logger.error(f"Erreur : {str(e)}")

if __name__ == "__main__":
    asyncio.run(analyze_page_structure()) 