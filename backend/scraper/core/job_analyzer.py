"""
Module d'analyse des offres avec DeepSeek.
"""

import json
import aiohttp
from typing import Dict, Any, Optional
from loguru import logger

from ..config.settings import (
    DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL,
    HTTP_TIMEOUT,
    REQUIRED_FIELDS
)

class JobAnalyzer:
    """Analyseur d'offres d'emploi utilisant DeepSeek."""

    def __init__(self):
        """Initialise l'analyseur avec les configurations par défaut."""
        self.api_key = DEEPSEEK_API_KEY
        self.base_url = DEEPSEEK_BASE_URL
        self.model = DEEPSEEK_MODEL
        self.timeout = HTTP_TIMEOUT

    async def analyze(self, html_content: str) -> Dict[str, Any]:
        """
        Analyse une offre d'emploi avec DeepSeek.
        
        Args:
            html_content: Le contenu HTML nettoyé de l'offre
            
        Returns:
            Dict[str, Any]: Les informations extraites de l'offre avec les clés en majuscules
        """
        try:
            # Construction du prompt
            prompt = self._construct_prompt(html_content)
            
            # Appel à l'API
            response = await self._make_api_call(prompt)
            
            # Validation de la réponse
            if not self._validate_response(response):
                logger.warning("⚠️ Réponse invalide de DeepSeek")
                return self._get_empty_response()
            
            # Transformation des clés en majuscules
            uppercase_response = {
                key.upper(): value 
                for key, value in response.items()
            }
            
            # Gestion de DURATION_DAYS selon CONTRACT_TYPE
            if uppercase_response.get('CONTRACT_TYPE') == 'CDI':
                uppercase_response['DURATION_DAYS'] = None
            elif uppercase_response.get('DURATION_DAYS') == "None":
                uppercase_response['DURATION_DAYS'] = None
            else:
                try:
                    uppercase_response['DURATION_DAYS'] = int(uppercase_response['DURATION_DAYS'])
                except (ValueError, TypeError):
                    uppercase_response['DURATION_DAYS'] = None
            
            return uppercase_response
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'analyse : {str(e)}")
            return self._get_empty_response()

    def _construct_prompt(self, html_content: str) -> str:
        """Construit le prompt pour DeepSeek."""
        return f"""Analyse cette offre d'emploi et extrait les informations suivantes au format JSON.
        
        Format attendu:
        {json.dumps(REQUIRED_FIELDS, indent=2, ensure_ascii=False)}
        
        Contenu HTML:
        {html_content}
        
        Réponds UNIQUEMENT avec un objet JSON valide."""

    async def _make_api_call(self, prompt: str) -> Dict[str, Any]:
        """Fait l'appel à l'API DeepSeek."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 1000
        }
        
        try:
            logger.info(f"📤 Envoi de la requête à {self.base_url}")
            logger.debug(f"Headers: {headers}")
            logger.debug(f"Payload size: {len(str(payload))} caractères")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.base_url,
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                ) as response:
                    if response.status != 200:
                        logger.error(f"❌ Erreur API: {response.status}")
                        response_text = await response.text()
                        logger.error(f"Réponse: {response_text}")
                        return self._get_empty_response()
                    
                    logger.info("✅ Réponse reçue de DeepSeek")
                    data = await response.json()
                    content = data['choices'][0]['message']['content']
                    logger.debug(f"Contenu brut: {content}")
                    
                    # Nettoyage du JSON
                    content = content.strip()
                    if content.startswith('```json'):
                        content = content[7:]
                    if content.endswith('```'):
                        content = content[:-3]
                    content = content.strip()
                    
                    return json.loads(content)
                    
        except json.JSONDecodeError as e:
            logger.error(f"❌ Erreur de parsing JSON: {str(e)}")
            logger.error(f"Contenu problématique: {content}")
            return self._get_empty_response()
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'appel API: {str(e)}")
            return self._get_empty_response()

    def _validate_response(self, response: Dict[str, Any]) -> bool:
        """Vérifie que la réponse contient tous les champs requis."""
        return all(field in response for field in REQUIRED_FIELDS)

    def _get_empty_response(self) -> Dict[str, Any]:
        """Retourne une réponse vide avec la structure attendue et les clés en majuscules."""
        return {field.upper(): "" for field in REQUIRED_FIELDS} 