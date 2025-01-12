import os
import json
import asyncio
import requests
from bs4 import BeautifulSoup
import aiohttp
from loguru import logger
from typing import Dict, Any, List, Optional, Tuple
from openai import OpenAI
from dotenv import load_dotenv
from ..models.job_offer import (
    ExperienceLevel, RemoteType, JobDomain, CompanyType, 
    ContractType, FrenchRegion, BelgianRegion, SwissRegion, Country
)

# Charger les variables d'environnement
load_dotenv()

# Configuration du client OpenAI pour DeepSeek
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

def clean_html(html_content: str) -> str:
    """Nettoie le HTML en gardant toutes les sections pertinentes."""
    logger.info("🔍 Début du nettoyage HTML...")
    
    # Création du parseur BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Log de la taille originale
    original_size = len(str(soup))
    logger.info(f"📊 Taille du HTML original : {original_size:,} caractères")
    
    logger.info("🔍 Analyse de la structure de la page...")
    
    # Suppression des scripts et styles
    for script in soup.find_all('script'):
        script.decompose()
    for style in soup.find_all('style'):
        style.decompose()
    
    # Ne garder que les sections pertinentes
    relevant_sections = []
    
    # Titre de l'offre
    title_div = soup.find('div', class_='text-2xl font-bold')
    if title_div:
        relevant_sections.append(title_div)
        logger.debug("✅ Section titre trouvée")
    
    # Description du poste (toutes les sections)
    description_divs = soup.find_all('div', class_='html-renderer prose-content')
    for div in description_divs:
        relevant_sections.append(div)
        logger.debug("✅ Section description trouvée")
    
    # Informations sur l'entreprise
    company_div = soup.find('div', class_='flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6')
    if company_div:
        relevant_sections.append(company_div)
        logger.debug("✅ Section entreprise trouvée")
    
    # Informations complémentaires (tags, détails, etc.)
    info_divs = soup.find_all('div', class_='tags')
    for div in info_divs:
        relevant_sections.append(div)
        logger.debug("✅ Section tags trouvée")
    
    # Détails du poste (durée, salaire, etc.)
    details_div = soup.find('div', class_='grid')
    if details_div:
        relevant_sections.append(details_div)
        logger.debug("✅ Section détails trouvée")
    
    # Informations de localisation
    location_div = soup.find('div', class_='flex items-center flex-wrap mt-2')
    if location_div:
        relevant_sections.append(location_div)
        logger.debug("✅ Section localisation trouvée")
    
    # Créer une nouvelle soupe avec uniquement les sections pertinentes
    new_soup = BeautifulSoup('<div id="job-content"></div>', 'html.parser')
    content_div = new_soup.find('div', id='job-content')
    
    for section in relevant_sections:
        content_div.append(section)
    
    # Calcul des statistiques de nettoyage
    cleaned_html = str(new_soup)
    cleaned_size = len(cleaned_html)
    reduction = ((original_size - cleaned_size) / original_size) * 100
    
    logger.success(f"✅ Nettoyage terminé : {cleaned_size:,} caractères (réduction de {reduction:.1f}%)")
    
    # Debug: afficher un extrait du HTML nettoyé
    logger.debug("📄 Extrait du HTML nettoyé (premiers 500 caractères) :")
    logger.debug(cleaned_html[:500] + "...")
    
    return cleaned_html

async def analyze_with_ai(html_content: str) -> Dict[str, Any]:
    """Analyse le contenu HTML avec l'API DeepSeek."""
    logger.info("🔄 Préparation de l'analyse DeepSeek...")
    logger.debug(f"📝 Longueur du HTML à analyser : {len(html_content)} caractères")

    # Configuration de base
    api_key = os.getenv("DEEPSEEK_API_KEY", "sk-0a17661a0a7946df9ae072c3635d1200")
    base_url = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com")

    # Définition de la réponse vide en cas d'erreur
    empty_response = {
        "TITLE": "",
        "COMPANY": "",
        "COMPANY_TYPE": "",
        "CONTRACT_TYPE": "",
        "XP": "",
        "DOMAIN": "",
        "REMOTE": "",
        "DESCRIPTION": "",
        "TECHNOLOGIES": [],
        "DURATION_DAYS": 0,
        "SALARY_MIN": 0,
        "SALARY_MAX": 0,
        "LOCATION": "",
        "COUNTRY": "",
        "REGION": "",
        "URL": ""
    }

    try:
        logger.info("📋 Construction du prompt...")
        prompt = f"""Analyze the following job offer HTML content and extract key information in JSON format.
        The response should follow this exact structure:
        {{
            "TITLE": "Job title",
            "COMPANY": "Company name",
            "COMPANY_TYPE": "One of: {[e.value for e in CompanyType]}",
            "CONTRACT_TYPE": "One of: {[e.value for e in ContractType]}",
            "XP": "One of: [Junior, Intermédiaire, Confirmé, Sénior]",
            "DOMAIN": "One of: {[e.value for e in JobDomain]}",
            "REMOTE": "One of: {[e.value for e in RemoteType]}",
            "TECHNOLOGIES": ["tech1", "tech2", ...],
            "DURATION_DAYS": number of days (0 if permanent),
            "SALARY_MIN": minimum salary (0 if not specified),
            "SALARY_MAX": maximum salary (0 if not specified),
            "LOCATION": "City name",
            "COUNTRY": "One of: {[e.value for e in Country]}",
            "REGION": "Region name based on country"
        }}

        HTML Content to analyze:
        {html_content}
        """

        logger.debug(f"📝 Longueur du prompt : {len(prompt)} caractères")
        logger.info("🌐 Initialisation de la requête DeepSeek...")
        logger.debug(f"🔑 Utilisation de l'API key : {api_key[:8]}...")
        logger.debug(f"🌍 URL de base : {base_url}")

        logger.info("📡 Envoi de la requête à l'API...")
        logger.debug("🔧 Configuration de la requête...")

        # Configuration des headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        logger.debug(f"📨 Headers configurés : {headers}")

        # Préparation du payload
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 1000,
            "stream": False
        }
        logger.debug("📦 Payload préparé")

        logger.info("⏳ Envoi de la requête HTTP...")
        url = f"{base_url}/v1/chat/completions"
        logger.debug(f"🌐 URL complète : {url}")
        logger.debug(f"📦 Taille du payload : {len(str(payload))} caractères")

        # Envoi de la requête avec un timeout de 60 secondes
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload, timeout=60) as response:
                if response.status == 200:
                    logger.success("✅ Réponse reçue avec succès")
                    response_text = await response.text()
                    logger.debug(f"📦 Taille de la réponse : {len(response_text)} caractères")
                    logger.debug(f"📄 Contenu de la réponse :\n{response_text}")
                    
                    # Extraction et parsing de la réponse
                    try:
                        response_json = json.loads(response_text)
                        content = response_json['choices'][0]['message']['content']
                        logger.debug(f"📄 Contenu extrait :\n{content}")
                        
                        # Nettoyage du contenu Markdown
                        content = content.replace("```json", "").replace("```", "").strip()
                        logger.debug(f"📄 Contenu nettoyé :\n{content}")
                        
                        result = json.loads(content)
                        logger.success("✅ Analyse terminée avec succès")
                        return result
                    except (KeyError, json.JSONDecodeError) as e:
                        logger.error(f"❌ Erreur lors du parsing de la réponse : {str(e)}")
                        logger.error(f"📄 Réponse problématique :\n{response_text}")
                        return empty_response
                else:
                    logger.error(f"❌ Erreur API (status: {response.status})")
                    error_text = await response.text()
                    logger.error(f"📄 Détails de l'erreur : {error_text}")
                    return empty_response

    except asyncio.TimeoutError:
        logger.error("⏰ Timeout de la requête HTTP (60s)")
        return empty_response
    except Exception as e:
        logger.error(f"❌ Erreur inattendue : {str(e)}")
        logger.exception(e)
        return empty_response

async def analyze_page_structure(url: str) -> Dict[str, Any]:
    """Analyse la structure d'une page d'offre d'emploi."""
    logger.info("🚀 Démarrage de l'analyse de l'offre...")
    logger.info(f"📌 URL à analyser : {url}")

    try:
        # Étape 1: Connexion et récupération du HTML
        logger.info("⏳ Tentative de connexion à l'URL...")
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    logger.success(f"✅ Connexion réussie (status: {response.status})")
                    html_content = await response.text()
                    logger.info(f"📄 Contenu HTML récupéré ({len(html_content)} caractères)")
                else:
                    logger.error(f"❌ Erreur lors de la connexion (status: {response.status})")
                    return {}

        # Étape 2: Parsing du HTML
        logger.info("🔍 Étape 1/4 : Parsing du HTML...")
        soup = BeautifulSoup(html_content, 'html.parser')
        logger.success("✅ Structure HTML parsée avec succès")

        # Étape 3: Nettoyage du HTML
        logger.info("🧹 Étape 2/4 : Nettoyage du HTML...")
        cleaned_html = clean_html(str(soup))
        logger.success(f"✅ HTML nettoyé avec succès (réduction de {len(html_content)} à {len(cleaned_html)} caractères)")

        # Étape 4: Analyse avec DeepSeek
        logger.info("🤖 Étape 3/4 : Analyse avec DeepSeek...")
        logger.info("⏳ Envoi de la requête à l'API DeepSeek...")
        result = await analyze_with_ai(cleaned_html)

        # Étape 5: Traitement des résultats
        logger.info("📊 Étape 4/4 : Traitement des résultats...")
        result["URL"] = url
        logger.success("✅ Analyse terminée avec succès")
        logger.info("\n📋 Résultats de l'analyse :")
        logger.info(f"\n{json.dumps(result, indent=2, ensure_ascii=False)}\n")

        return result

    except Exception as e:
        logger.error(f"❌ Erreur lors de l'analyse : {str(e)}")
        logger.exception(e)
        return {}

if __name__ == "__main__":
    asyncio.run(analyze_page_structure("https://www.free-work.com/fr/tech-it/consultant/job-mission/product-manager-ms-dynamics-365-finance")) 