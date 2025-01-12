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

    def _should_continue_to_next_page(self, html: str, source: Dict, current_page_urls: List[str]) -> bool:
        """
        Détermine s'il faut continuer vers la page suivante.
        La décision est basée sur :
        1. Si la page actuelle a retourné des offres
        2. Si un bouton "suivant" est présent et actif
        
        Args:
            html: Le contenu HTML de la page courante
            source: Configuration de la source
            current_page_urls: URLs trouvées sur la page actuelle
            
        Returns:
            bool: True s'il faut continuer vers la page suivante
        """
        # Si la page actuelle n'a pas d'offres, inutile de continuer
        if not current_page_urls:
            logger.debug("🚫 Page sans offres, arrêt du scraping")
            return False
            
        # Vérifie la présence d'un bouton suivant actif
        soup = BeautifulSoup(html, 'lxml')
        next_button = soup.select_one(source['selectors']['next_button'])
        has_next = next_button is not None and not next_button.get('disabled')
        
        logger.debug(f"📊 Page actuelle : {len(current_page_urls)} offres, bouton suivant : {'présent' if has_next else 'absent'}")
        return has_next

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
        continue_scraping = True
        
        logger.info(f"🔍 Début du scraping de {source['name']}...")
        
        while continue_scraping and page <= source['max_pages']:
            logger.info(f"📄 Traitement de la page {page}")
            
            # 1. Récupère le HTML de la page
            url = f"{source['base_url']}?page={page}"
            html = await self._fetch_page(url)
            if not html:
                break
                
            # 2. Extrait les URLs de la page courante
            page_urls = self._extract_job_urls(html, source)
            all_urls.extend(page_urls)
            
            # 3. Détermine s'il faut continuer vers la page suivante
            continue_scraping = self._should_continue_to_next_page(html, source, page_urls)
            
            # 4. Passe à la page suivante si nécessaire
            if continue_scraping:
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