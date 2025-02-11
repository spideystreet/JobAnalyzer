"""
Module d'analyse des offres avec Mistral AI.
"""

import json
from typing import Dict, Any, Optional
from loguru import logger
from mistralai import Mistral

from ..config.settings import (
    MISTRAL_API_KEY,
    MISTRAL_MODEL,
    HTTP_TIMEOUT,
    REQUIRED_FIELDS
)

class JobAnalyzer:
    """Analyseur d'offres d'emploi utilisant Mistral AI."""

    def __init__(self):
        """Initialise l'analyseur avec les configurations par défaut."""
        logger.info(f"🔧 Initialisation de l'analyseur Mistral avec le modèle {MISTRAL_MODEL}")
        self.client = Mistral(api_key=MISTRAL_API_KEY)
        self.model = MISTRAL_MODEL
        self.timeout = HTTP_TIMEOUT

    async def analyze(self, html_content: str) -> Dict[str, Any]:
        """
        Analyse une offre d'emploi avec Mistral AI.
        
        Args:
            html_content: Le contenu HTML nettoyé de l'offre
            
        Returns:
            Dict[str, Any]: Les informations extraites de l'offre avec les clés en majuscules
        """
        try:
            logger.debug(f"📝 Longueur du contenu HTML à analyser : {len(html_content)} caractères")
            
            # Construction du prompt
            prompt = self._construct_prompt(html_content)
            logger.debug(f"🔍 Prompt généré de {len(prompt)} caractères")
            
            # Appel à l'API
            response = await self._make_api_call(prompt)
            
            # Validation de la réponse
            if not self._validate_response(response):
                logger.warning("⚠️ Réponse invalide de Mistral - Champs manquants")
                logger.debug(f"Champs manquants : {[field for field in REQUIRED_FIELDS if field not in response]}")
                return self._get_empty_response()
            
            logger.info("✅ Réponse valide reçue de Mistral")
            
            # Transformation des clés en majuscules
            uppercase_response = {
                key.upper(): value 
                for key, value in response.items()
            }
            
            # Gestion de DURATION_DAYS selon CONTRACT_TYPE
            logger.debug(f"📊 Traitement de DURATION_DAYS - Type de contrat : {uppercase_response.get('CONTRACT_TYPE')}")
            if uppercase_response.get('CONTRACT_TYPE') == 'CDI':
                uppercase_response['DURATION_DAYS'] = None
                logger.debug("ℹ️ DURATION_DAYS mis à None car CDI")
            elif uppercase_response.get('DURATION_DAYS') == "None":
                uppercase_response['DURATION_DAYS'] = None
                logger.debug("ℹ️ DURATION_DAYS conservé à None")
            else:
                try:
                    uppercase_response['DURATION_DAYS'] = int(uppercase_response['DURATION_DAYS'])
                    logger.debug(f"ℹ️ DURATION_DAYS converti en entier : {uppercase_response['DURATION_DAYS']}")
                except (ValueError, TypeError):
                    uppercase_response['DURATION_DAYS'] = None
                    logger.warning("⚠️ Impossible de convertir DURATION_DAYS en entier")
            
            # Assurer que CONTRACT_TYPE est une liste
            contract_type = uppercase_response.get('CONTRACT_TYPE')
            logger.debug(f"📋 Traitement de CONTRACT_TYPE : {contract_type}")
            if contract_type:
                if isinstance(contract_type, str):
                    uppercase_response['CONTRACT_TYPE'] = [contract_type]
                    logger.debug(f"ℹ️ CONTRACT_TYPE converti en liste : {uppercase_response['CONTRACT_TYPE']}")
                elif not isinstance(contract_type, list):
                    uppercase_response['CONTRACT_TYPE'] = [str(contract_type)]
                    logger.debug(f"ℹ️ CONTRACT_TYPE converti en liste de strings : {uppercase_response['CONTRACT_TYPE']}")
            else:
                uppercase_response['CONTRACT_TYPE'] = []
                logger.warning("⚠️ Aucun type de contrat trouvé")
            
            logger.info("✨ Analyse terminée avec succès")
            logger.debug(f"📊 Résultat final : {json.dumps(uppercase_response, indent=2, ensure_ascii=False)}")
            
            return uppercase_response
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'analyse : {str(e)}")
            logger.exception("Détails de l'erreur :")
            return self._get_empty_response()

    def _construct_prompt(self, html_content: str) -> str:
        """Construit le prompt pour Mistral."""
        logger.debug("🔨 Construction du prompt")
        prompt = f"""Analyse cette offre d'emploi et extrait les informations suivantes au format JSON.
        
        Format attendu:
        {json.dumps(REQUIRED_FIELDS, indent=2, ensure_ascii=False)}
        
        Contenu HTML:
        {html_content}
        
        Réponds UNIQUEMENT avec un objet JSON valide."""
        
        logger.debug(f"📝 Prompt construit ({len(prompt)} caractères)")
        return prompt

    async def _make_api_call(self, prompt: str) -> Dict[str, Any]:
        """Fait l'appel à l'API Mistral."""
        try:
            logger.info("📤 Envoi de la requête à Mistral AI")
            logger.debug(f"🔧 Configuration : model={self.model}, temperature=0.3, max_tokens=1000")
            
            chat_response = self.client.chat.complete(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                temperature=0.3,
                max_tokens=1000
            )
            
            logger.info("📥 Réponse reçue de Mistral AI")
            content = chat_response.choices[0].message.content
            logger.debug(f"📄 Contenu brut reçu : {content[:200]}...")
            
            # Nettoyage du JSON
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
                logger.debug("🧹 Suppression du préfixe ```json")
            if content.endswith('```'):
                content = content[:-3]
                logger.debug("🧹 Suppression du suffixe ```")
            content = content.strip()
            
            parsed_content = json.loads(content)
            logger.info("✅ Parsing JSON réussi")
            logger.debug(f"🔍 Nombre de champs trouvés : {len(parsed_content)}")
            
            return parsed_content
                    
        except json.JSONDecodeError as e:
            logger.error(f"❌ Erreur de parsing JSON : {str(e)}")
            logger.error(f"📄 Contenu problématique : {content}")
            logger.exception("Détails de l'erreur :")
            return self._get_empty_response()
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'appel API : {str(e)}")
            logger.exception("Détails de l'erreur :")
            return self._get_empty_response()

    def _validate_response(self, response: Dict[str, Any]) -> bool:
        """Vérifie que la réponse contient tous les champs requis."""
        missing_fields = [field for field in REQUIRED_FIELDS if field not in response]
        if missing_fields:
            logger.warning(f"⚠️ Champs manquants dans la réponse : {missing_fields}")
            return False
        logger.debug("✅ Tous les champs requis sont présents")
        return True

    def _get_empty_response(self) -> Dict[str, Any]:
        """Retourne une réponse vide avec la structure attendue et les clés en majuscules."""
        logger.debug("⚪ Génération d'une réponse vide")
        return {field.upper(): "" for field in REQUIRED_FIELDS} 