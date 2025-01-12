"""
Module de gestion du cache Redis pour le suivi des offres traitées.
"""

from datetime import datetime
from typing import Optional
from redis import Redis
from loguru import logger

from ..config.settings import (
    REDIS_HOST,
    REDIS_PORT,
    REDIS_DB,
    CACHE_TTL
)

class JobCache:
    """
    Gestion du cache Redis pour le suivi des offres d'emploi traitées.
    Utilise Redis pour stocker les URLs avec un TTL de 48 heures.
    """

    def __init__(self):
        """Initialise la connexion Redis avec les paramètres de configuration."""
        try:
            self.redis = Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                db=REDIS_DB,
                decode_responses=True  # Pour avoir des str au lieu de bytes
            )
            logger.info(f"✅ Connexion Redis établie ({REDIS_HOST}:{REDIS_PORT})")
        except Exception as e:
            logger.error(f"❌ Erreur de connexion Redis: {str(e)}")
            raise

    def _get_key(self, url: str) -> str:
        """
        Génère la clé Redis pour une URL.
        
        Args:
            url: L'URL de l'offre
            
        Returns:
            str: La clé formatée
        """
        return f"job:{url}"

    async def is_processed(self, url: str) -> bool:
        """
        Vérifie si une URL a déjà été traitée.
        
        Args:
            url: L'URL à vérifier
            
        Returns:
            bool: True si l'URL est dans le cache
        """
        try:
            return bool(self.redis.exists(self._get_key(url)))
        except Exception as e:
            logger.error(f"❌ Erreur lors de la vérification du cache: {str(e)}")
            return False

    async def mark_processed(self, url: str) -> None:
        """
        Marque une URL comme traitée avec un TTL.
        
        Args:
            url: L'URL à marquer
        """
        try:
            key = self._get_key(url)
            self.redis.set(
                key,
                str(datetime.now().timestamp()),
                ex=CACHE_TTL
            )
            logger.debug(f"✅ URL marquée comme traitée: {url}")
        except Exception as e:
            logger.error(f"❌ Erreur lors du marquage dans le cache: {str(e)}")

    async def get_last_processed_time(self, url: str) -> Optional[datetime]:
        """
        Récupère la dernière date de traitement d'une URL.
        
        Args:
            url: L'URL à vérifier
            
        Returns:
            Optional[datetime]: La date de dernier traitement ou None
        """
        try:
            timestamp = self.redis.get(self._get_key(url))
            if timestamp:
                return datetime.fromtimestamp(float(timestamp))
            return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération du timestamp: {str(e)}")
            return None

    def clear_cache(self) -> None:
        """Vide le cache (utile pour les tests)."""
        try:
            self.redis.flushdb()
            logger.warning("🗑 Cache Redis vidé")
        except Exception as e:
            logger.error(f"❌ Erreur lors du vidage du cache: {str(e)}")

    def close(self) -> None:
        """Ferme la connexion Redis."""
        try:
            self.redis.close()
            logger.info("👋 Connexion Redis fermée")
        except Exception as e:
            logger.error(f"❌ Erreur lors de la fermeture de Redis: {str(e)}") 