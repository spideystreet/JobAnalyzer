"""
Script de test pour le scraping de listes d'offres.
"""

import asyncio
from loguru import logger

from backend.scraper.core.list_scraper import JobListScraper
from backend.scraper.core.job_scraper import JobScraper
from backend.scraper.core.logger import setup_logger
from backend.scraper.config.settings import ANALYSIS_LOG_FORMAT

async def test_list_scraping():
    """Teste le scraping d'une liste d'offres."""
    try:
        # Initialisation des scrapers
        list_scraper = JobListScraper()
        job_scraper = JobScraper()
        
        logger.info("🚀 Démarrage du scraping de liste")
        
        # Récupération des URLs
        urls = await list_scraper.get_all_job_urls()
        logger.info(f"📑 {len(urls)} offres trouvées")
        
        # Statistiques
        success = 0
        failed = 0
        
        # Traitement de chaque offre
        for url in urls:
            try:
                logger.info(f"🔍 Analyse de : {url}")
                result = await job_scraper.scrape_job_offer(url)
                
                if result:
                    # Affichage des résultats
                    logger.info(ANALYSIS_LOG_FORMAT.format(**result, **result['cleaning_stats']))
                    success += 1
                else:
                    failed += 1
                    logger.error(f"❌ Échec de l'analyse pour : {url}")
                
                # Petit délai pour ne pas surcharger le site
                await asyncio.sleep(2)
                
            except Exception as e:
                failed += 1
                logger.error(f"❌ Erreur lors du traitement de {url}: {str(e)}")
        
        # Bilan final
        logger.success(
            f"\n📊 Bilan du scraping:\n"
            f"  - Total offres trouvées: {len(urls)}\n"
            f"  - Succès: {success}\n"
            f"  - Échecs: {failed}"
        )
            
    except Exception as e:
        logger.error(f"❌ Erreur globale : {str(e)}")

if __name__ == "__main__":
    # Configuration du logger
    setup_logger()
    
    # Exécution du test
    asyncio.run(test_list_scraping()) 