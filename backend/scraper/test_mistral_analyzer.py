"""
Script de test pour l'analyseur Mistral AI.
"""

import asyncio
from loguru import logger
import json
import aiohttp

from backend.scraper.core.job_analyzer import JobAnalyzer
from backend.scraper.core.html_cleaner import HTMLCleaner
from backend.scraper.config.settings import ANALYSIS_LOG_FORMAT

async def fetch_job_offer(url: str) -> str:
    """Récupère le contenu HTML d'une offre d'emploi."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.error(f"❌ Erreur HTTP {response.status}")
                    return None
    except Exception as e:
        logger.error(f"❌ Erreur lors de la récupération de l'offre : {str(e)}")
        return None

async def test_mistral_analyzer():
    """Teste l'analyse d'une offre avec Mistral AI."""
    try:
        # URL d'une vraie offre
        url = "https://www.free-work.com/fr/tech-it/consultant/job-mission/product-manager-ms-dynamics-365-finance"
        
        logger.info(f"🌐 Récupération de l'offre depuis {url}")
        html_content = await fetch_job_offer(url)
        
        if not html_content:
            logger.error("❌ Impossible de récupérer l'offre")
            return
            
        logger.info(f"📄 Contenu HTML brut récupéré ({len(html_content)} caractères)")
        
        # Nettoyage du HTML
        cleaner = HTMLCleaner()
        cleaned_html = cleaner.clean(html_content)
        logger.info(f"🧹 Contenu HTML nettoyé ({len(cleaned_html)} caractères) - Réduction de {((len(html_content) - len(cleaned_html)) / len(html_content) * 100):.1f}%")
        
        # Initialisation de l'analyseur
        analyzer = JobAnalyzer()
        
        logger.info("🚀 Démarrage du test d'analyse Mistral")
        
        # Analyse de l'offre
        result = await analyzer.analyze(cleaned_html)
        
        # Affichage des résultats
        if result:
            logger.info("✅ Analyse réussie")
            logger.info("\nRésultat brut:")
            logger.info(json.dumps(result, indent=2, ensure_ascii=False))
            
            # Affichage formaté
            logger.info("\nRésultat formaté:")
            logger.info(ANALYSIS_LOG_FORMAT.format(
                **result,
                url=url,
                original_size=len(html_content),
                cleaned_size=len(cleaned_html),
                scripts_removed=cleaner.stats.get('scripts_removed', 0)
            ))
        else:
            logger.error("❌ L'analyse n'a pas retourné de résultats")
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test : {str(e)}")
        logger.exception("Détails de l'erreur :")

if __name__ == "__main__":
    # Configuration du logger
    logger.remove()
    logger.add(
        lambda msg: print(msg),
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        level="DEBUG"  # On met le niveau à DEBUG pour voir tous les logs
    )
    
    # Exécution du test
    asyncio.run(test_mistral_analyzer()) 