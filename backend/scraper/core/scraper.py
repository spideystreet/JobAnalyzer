import asyncio
from typing import List
import logging

logger = logging.getLogger(__name__)

class Scraper:
    async def scrape_job_list(self) -> List[str]:
        """
        Scrape la liste des offres d'emploi.
        """
        job_urls = []
        page = 1
        
        while True:
            if page > self.max_pages:
                logger.info(f"🛑 Limite de {self.max_pages} pages atteinte")
                break
                
            url = self._get_page_url(page)
            logger.debug(f"📄 Scraping de la page {page}: {url}")
            
            try:
                soup = await self._get_page_content(url)
                if not soup:
                    break
                    
                # Extraction des liens d'offres
                new_urls = self._extract_job_urls(soup)
                if not new_urls:
                    logger.info("🏁 Plus d'offres trouvées")
                    break
                    
                job_urls.extend(new_urls)
                logger.info(f"✅ Page {page}: {len(new_urls)} offres trouvées")
                
                # Vérification du bouton suivant
                if not self._has_next_page(soup):
                    logger.info("🏁 Dernière page atteinte")
                    break
                    
                page += 1
                await asyncio.sleep(REQUEST_DELAY)
                
            except Exception as e:
                logger.error(f"❌ Erreur lors du scraping de la page {page}: {str(e)}")
                break
                
        logger.info(f"📊 Total: {len(job_urls)} offres trouvées")
        return job_urls 