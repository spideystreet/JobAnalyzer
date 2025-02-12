"""
Script de test pour l'analyseur Mistral AI.
"""

import asyncio
from loguru import logger
import json
import aiohttp
from typing import List, Dict, Any

from backend.scraper.core.job_analyzer import JobAnalyzer
from backend.scraper.core.html_cleaner import HTMLCleaner
from backend.scraper.config.settings import ANALYSIS_LOG_FORMAT

# Liste des offres à tester
TEST_OFFERS = [
    {
        "url": "https://www.free-work.com/fr/tech-it/consultant/job-mission/product-manager-ms-dynamics-365-finance",
        "description": "Offre Product Manager"
    },
    {
        "url": "https://www.free-work.com/fr/tech-it/consultant/job-mission/developpeur-fullstack-javascript-nodejs-reactjs",
        "description": "Offre Développeur Fullstack"
    },
    {
        "url": "https://www.free-work.com/fr/tech-it/consultant/job-mission/data-engineer-python-aws",
        "description": "Offre Data Engineer"
    },
    {
        "url": "https://www.free-work.com/fr/tech-it/consultant/job-mission/lead-tech-java-spring",
        "description": "Offre Lead Tech Java"
    }
]

async def fetch_job_offer(url: str) -> str:
    """Récupère le contenu HTML d'une offre d'emploi."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.error(f"❌ Erreur HTTP {response.status} pour {url}")
                    return None
    except Exception as e:
        logger.error(f"❌ Erreur lors de la récupération de l'offre {url}: {str(e)}")
        return None

async def analyze_single_offer(url: str, description: str) -> Dict[str, Any]:
    """Analyse une seule offre d'emploi."""
    try:
        logger.info(f"🔍 Test de l'offre: {description}")
        logger.info(f"🌐 Récupération depuis {url}")
        
        html_content = await fetch_job_offer(url)
        
        if not html_content:
            logger.error("❌ Impossible de récupérer l'offre")
            return None
            
        logger.info(f"📄 Contenu HTML brut récupéré ({len(html_content)} caractères)")
        
        # Nettoyage du HTML
        cleaner = HTMLCleaner()
        cleaned_html = cleaner.clean(html_content)
        logger.info(f"🧹 Contenu nettoyé ({len(cleaned_html)} caractères) - Réduction de {((len(html_content) - len(cleaned_html)) / len(html_content) * 100):.1f}%")
        
        # Analyse de l'offre
        analyzer = JobAnalyzer()
        result = await analyzer.analyze(cleaned_html, url)
        
        if result:
            # Ajout des métadonnées de test
            result['TEST_URL'] = url
            result['TEST_DESCRIPTION'] = description
            result['ORIGINAL_SIZE'] = len(html_content)
            result['CLEANED_SIZE'] = len(cleaned_html)
            result['SCRIPTS_REMOVED'] = cleaner.stats.get('scripts_removed', 0)
            
            logger.info(f"✅ Analyse réussie pour {description}")
            return result
        else:
            logger.error(f"❌ Échec de l'analyse pour {description}")
            return None
            
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'analyse de {description}: {str(e)}")
        logger.exception("Détails de l'erreur:")
        return None

async def test_mistral_analyzer():
    """Teste l'analyse de plusieurs offres avec Mistral AI."""
    try:
        logger.info(f"🚀 Démarrage des tests sur {len(TEST_OFFERS)} offres")
        
        # Analyse de toutes les offres en parallèle
        tasks = [
            analyze_single_offer(offer['url'], offer['description'])
            for offer in TEST_OFFERS
        ]
        results = await asyncio.gather(*tasks)
        
        # Affichage des résultats
        success_count = len([r for r in results if r is not None])
        logger.info(f"\n📊 Bilan des tests:")
        logger.info(f"  - Offres testées: {len(TEST_OFFERS)}")
        logger.info(f"  - Analyses réussies: {success_count}")
        logger.info(f"  - Analyses échouées: {len(TEST_OFFERS) - success_count}")
        
        # Affichage détaillé des résultats
        logger.info("\n🔍 Résultats détaillés:")
        for result in results:
            if result:
                logger.info(f"\n=== {result['TEST_DESCRIPTION']} ===")
                logger.info(ANALYSIS_LOG_FORMAT.format(
                    **{k: v for k, v in result.items() if k not in ['TEST_URL', 'TEST_DESCRIPTION', 'ORIGINAL_SIZE', 'CLEANED_SIZE', 'SCRIPTS_REMOVED']},
                    url=result['TEST_URL'],
                    original_size=result['ORIGINAL_SIZE'],
                    cleaned_size=result['CLEANED_SIZE'],
                    scripts_removed=result['SCRIPTS_REMOVED']
                ))
                
    except Exception as e:
        logger.error(f"❌ Erreur fatale lors des tests: {str(e)}")
        logger.exception("Détails de l'erreur:")

if __name__ == "__main__":
    # Configuration du logger
    logger.remove()
    logger.add(
        lambda msg: print(msg),
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        level="DEBUG"  # On met le niveau à DEBUG pour voir tous les logs
    )
    
    # Exécution des tests
    asyncio.run(test_mistral_analyzer()) 