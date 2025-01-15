"""
"""
Module principal de scraping des offres.
"""

import aiohttp
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup
from loguru import logger

from .html_cleaner import HTMLCleaner
from .job_analyzer import JobAnalyzer
from ..config.settings import HTTP_TIMEOUT

class JobScraper:
    """Scraper principal pour les offres d'emploi."""

    def __init__(self):
        """Initialise le scraper avec ses composants."""
        self.cleaner = HTMLCleaner()
        self.analyzer = JobAnalyzer()
        self.timeout = HTTP_TIMEOUT

    async def scrape_job_offer(self, url: str) -> Dict[str, Any]:
        """
        Scrape et analyse une offre d'emploi.
        
        Args:
            url: L'URL de l'offre à scraper
            
        Returns:
            Dict[str, Any]: Les informations extraites de l'offre
        """
        try:
            # 1. Récupère le HTML
            html = await self._fetch_page(url)
            if not html:
                return self._get_empty_result()

            # 2. Nettoie le HTML
            cleaned_html = self.cleaner.clean(html)
            
            # 3. Analyse avec DeepSeek
            result = await self.analyzer.analyze(cleaned_html)
            
            # 4. Ajoute les métadonnées
            result['url'] = url
            result['cleaning_stats'] = self.cleaner.stats
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du scraping de {url}: {str(e)}")
            return self._get_empty_result()

    async def _fetch_page(self, url: str) -> Optional[str]:
        """Récupère le contenu HTML d'une page."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=self.timeout) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        logger.warning(f"⚠️ Statut HTTP inattendu: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération de {url}: {str(e)}")
            return None

    def _get_empty_result(self) -> Dict[str, Any]:
        """Retourne un résultat vide en cas d'erreur."""
        return {
            'url': '',
            'title': '',
            'company': '',
            'company_type': '',
            'contract_type': '',
            'domain': '',
            'xp': '',
            'remote': '',
            'country': '',
            'region': '',
            'city': '',
            'technos': [],
            'tjm_min': None,
            'tjm_max': None,
            'duration_days': None,
            'cleaning_stats': {}
        }
