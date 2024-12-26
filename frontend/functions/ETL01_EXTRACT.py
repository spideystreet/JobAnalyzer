import os
from openai import OpenAI
import logging
from playwright.sync_api import sync_playwright
import json

logger = logging.getLogger(__name__)

class JobExtractor:
    def __init__(self):
        logger.debug("Initializing JobExtractor")
        try:
            self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(headless=True)
            logger.debug("Services initialized successfully")
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def extract(self, url: str) -> dict:
        """Extrait et analyse une offre d'emploi."""
        try:
            # 1. Récupérer le contenu de la page
            page = self.browser.new_page()
            page.goto(url, wait_until="networkidle")
            page_text = page.evaluate('() => document.body.innerText')
            page.close()
            
            # 2. Analyser avec GPT
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                temperature=0.1,
                messages=[{
                    "role": "system",
                    "content": "Tu es un expert en analyse d'offres d'emploi. Résume l'offre de façon concise et structurée."
                }, {
                    "role": "user",
                    "content": f"Voici une offre d'emploi, analyse-la et donne les informations principales :\n\n{page_text}"
                }]
            )
            
            return {
                "url": url,
                "analysis": response.choices[0].message.content
            }
            
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return {"error": str(e)}

    def __del__(self):
        try:
            if hasattr(self, 'browser'): self.browser.close()
            if hasattr(self, 'playwright'): self.playwright.stop()
        except Exception as e:
            logger.error(f"Cleanup error: {str(e)}") 