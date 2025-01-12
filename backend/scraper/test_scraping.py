"""
Script de test pour le scraping d'offres.
"""

import asyncio
from loguru import logger

from backend.scraper.core.job_scraper import JobScraper
from backend.scraper.config.settings import ANALYSIS_LOG_FORMAT
from backend.scraper.core.logger import setup_logger

async def test_scraping():
    """Teste le scraping d'une offre."""
    try:
        # URL de test
        url = "https://www.free-work.com/fr/tech-it/consultant/job-mission/product-manager-ms-dynamics-365-finance"
        
        # Initialisation du scraper
        scraper = JobScraper()
        
        logger.info(f"🚀 Test de scraping sur : {url}")
        
        # Scraping de l'offre
        result = await scraper.scrape_job_offer(url)
        
        # Utilisation du format personnalisé pour l'affichage
        logger.info(ANALYSIS_LOG_FORMAT.format(**result, **result['cleaning_stats']))
            
    except Exception as e:
        logger.error(f"❌ Erreur lors du test : {str(e)}")

if __name__ == "__main__":
    # Configuration du logger
    setup_logger()
    
    # Exécution du test
    asyncio.run(test_scraping()) 