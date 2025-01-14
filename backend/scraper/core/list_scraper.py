"""
Module de scraping de la liste des offres d'emploi.
"""

import asyncio
import aiohttp
from typing import List, Optional, Dict
from bs4 import BeautifulSoup
from loguru import logger

from ..config.settings import (
    SCRAPING_SOURCES,
    REQUEST_DELAY,
    HTTP_TIMEOUT
)

class JobListScraper:
    """
    Scraper pour la liste des offres d'emploi.
    Parcourt les pages et extrait les URLs des offres de plusieurs sources.
    """

    def __init__(self):
        """Initialise le scraper de liste."""
        self.sources = [s for s in SCRAPING_SOURCES if s['enabled']]
        self.timeout = HTTP_TIMEOUT

    async def _fetch_page(self, url: str) -> Optional[str]:
        """
        Récupère le contenu HTML d'une page.
        
        Args:
            url: L'URL de la page à récupérer
            
        Returns:
            Optional[str]: Le contenu HTML ou None en cas d'erreur
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=self.timeout) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        logger.warning(f"⚠️ Statut HTTP inattendu: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération de la page: {str(e)}")
            return None

    def _extract_job_urls(self, html: str, source: Dict) -> List[str]:
        """
        Extrait les URLs des offres d'une page.
        
        Args:
            html: Le contenu HTML de la page
            source: Configuration de la source
            
        Returns:
            List[str]: Liste des URLs trouvées
        """
        urls = []
        soup = BeautifulSoup(html, 'lxml')
        
        # Log pour debug
        logger.debug(f"🔍 HTML reçu ({len(html)} caractères)")
        logger.debug(f"🎯 Recherche des liens avec le sélecteur: {source['selectors']['job_link']}")
        
        # Trouve tous les liens d'offres selon le sélecteur de la source
        job_links = soup.select(source['selectors']['job_link'])
        logger.debug(f"🔗 Nombre de liens trouvés: {len(job_links)}")
        
        for link in job_links:
            href = link.get('href')
            if href:
                # Log pour debug
                logger.debug(f"📎 Lien d'offre trouvé: {href}")
                
                # Construit l'URL complète si nécessaire
                if not href.startswith('http'):
                    base = "https://www.free-work.com"  # URL de base fixe
                    href = f"{base}{href}"
                urls.append(href)
                
        logger.info(f"📑 {len(urls)} offres trouvées sur la page")
        return urls

    async def _scrape_source(self, source: Dict) -> List[str]:
        """
        Scrape toutes les offres d'une source.
        
        Args:
            source: Configuration de la source
            
        Returns:
            List[str]: Liste des URLs trouvées
        """
        all_urls = []
        page = 1
        max_pages = source.get('max_pages')
        
        logger.info(f"🔍 Début du scraping de {source['name']}...")
        
        while True:
            # Vérifie si on a atteint la limite de pages
            if max_pages and page > max_pages:
                logger.info(f"🛑 Limite de {max_pages} pages atteinte")
                break

            logger.info(f"📄 Traitement de la page {page}")
            
            # 1. Récupère le HTML de la page
            url = f"{source['base_url']}&page={page}" if '?' in source['base_url'] else f"{source['base_url']}?page={page}"
            html = await self._fetch_page(url)
            if not html:
                logger.warning(f"⚠️ Impossible de récupérer la page {page}")
                break
                
            # 2. Extrait les URLs de la page courante
            page_urls = self._extract_job_urls(html, source)
            all_urls.extend(page_urls)
            
            # 3. Vérifie s'il faut continuer
            if not page_urls:
                logger.debug("🚫 Page sans offres, arrêt du scraping")
                break
                
            # Vérifie la présence d'un bouton suivant actif
            soup = BeautifulSoup(html, 'lxml')
            next_button = soup.select_one(source['selectors']['next_button'])
            if not next_button or next_button.get('disabled'):
                logger.debug("🚫 Plus de pages suivantes")
                break
            
            # 4. Passe à la page suivante
            page += 1
            logger.debug(f"⏳ Attente de {REQUEST_DELAY} secondes avant la page suivante...")
            await asyncio.sleep(REQUEST_DELAY)
        
        logger.success(f"✅ Scraping de {source['name']} terminé : {len(all_urls)} offres trouvées")
        return all_urls

    async def get_all_job_urls(self) -> List[str]:
        """
        Récupère les URLs de toutes les offres de toutes les sources.
        
        Returns:
            List[str]: Liste de toutes les URLs d'offres trouvées
        """
        all_urls = []
        
        for source in self.sources:
            try:
                urls = await self._scrape_source(source)
                all_urls.extend(urls)
            except Exception as e:
                logger.error(f"❌ Erreur lors du scraping de {source['name']}: {str(e)}")
        
        logger.success(f"✅ Scraping terminé : {len(all_urls)} offres trouvées au total")
        return all_urls 