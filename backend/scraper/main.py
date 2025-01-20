"""
Point d'entrée principal du scraper d'offres d'emploi.
"""

import asyncio
import argparse
from typing import Optional
from loguru import logger

from .core.job_scraper import JobScraper
from .config.settings import LOG_LEVEL, LOG_FORMAT

def setup_logging():
    """Configure le logging avec les paramètres définis."""
    logger.remove()  # Supprime les handlers par défaut
    logger.add(
        "logs/scraper.log",
        rotation="1 day",
        retention="7 days",
        format=LOG_FORMAT,
        level=LOG_LEVEL
    )
    logger.add(lambda msg: print(msg), level=LOG_LEVEL, format=LOG_FORMAT)

def parse_args():
    """Parse les arguments de la ligne de commande."""
    parser = argparse.ArgumentParser(description="Scraper d'offres d'emploi")
    parser.add_argument(
        "url",
        help="L'URL de l'offre d'emploi à analyser"
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Active le mode debug"
    )
    return parser.parse_args()

async def main(url: str) -> Optional[dict]:
    """
    Point d'entrée principal du scraper.
    
    Args:
        url: L'URL de l'offre d'emploi à analyser
        
    Returns:
        Optional[dict]: Les informations extraites ou None en cas d'erreur
    """
    try:
        scraper = JobScraper()
        return await scraper.scrape_job_offer(url)
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale: {str(e)}")
        return None

if __name__ == "__main__":
    # Parse les arguments
    args = parse_args()
    
    # Configure le logging
    if args.debug:
        logger.remove()
        logger.add(lambda msg: print(msg), level="DEBUG", format=LOG_FORMAT)
    else:
        setup_logging()
    
    # Lance le scraping
    logger.info("🚀 Démarrage du scraper...")
    result = asyncio.run(main(args.url))
    
    if result:
        logger.success("✅ Scraping terminé avec succès")
        logger.info("📊 Résultats:")
        for key, value in result.items():
            if key != 'html_stats':  # On n'affiche pas les stats HTML par défaut
                logger.info(f"  {key}: {value}")
    else:
        logger.error("❌ Le scraping a échoué") 