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

    def _get_key(self, url: str, prefix: str = "job") -> str:
        """
        Génère la clé Redis pour une URL.
        
        Args:
            url: L'URL de l'offre
            prefix: Préfixe pour différencier les types de données
            
        Returns:
            str: La clé formatée
        """
        return f"{prefix}:{url}"

    async def store_raw_html(self, url: str, html_content: str) -> None:
        """
        Stocke le HTML brut d'une offre dans Redis.
        
        Args:
            url: L'URL de l'offre
            html_content: Le contenu HTML brut à stocker
        """
        try:
            # Utilise un préfixe différent pour le HTML brut
            key = self._get_key(url, prefix="raw_html")
            self.redis.set(
                key,
                html_content,
                ex=CACHE_TTL
            )
            # Marque aussi l'URL comme traitée
            await self.mark_processed(url)
            logger.debug(f"✅ HTML stocké pour: {url}")
        except Exception as e:
            logger.error(f"❌ Erreur lors du stockage du HTML: {str(e)}")
            raise

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

    async def get_all_raw_html_keys(self) -> list[str]:
        """
        Récupère toutes les clés des HTML bruts stockés.
        
        Returns:
            list[str]: Liste des clés raw_html
        """
        try:
            pattern = self._get_key("*", prefix="raw_html")
            keys = self.redis.keys(pattern)
            logger.debug(f"✅ {len(keys)} clés raw_html trouvées")
            return keys
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération des clés raw_html: {str(e)}")
            return []

    async def get_raw_html(self, key: str) -> Optional[str]:
        """
        Récupère le HTML brut pour une clé donnée.
        
        Args:
            key: La clé Redis complète (raw_html:url)
            
        Returns:
            Optional[str]: Le contenu HTML ou None
        """
        try:
            content = self.redis.get(key)
            if content:
                logger.debug(f"✅ HTML récupéré pour: {key}")
                return content
            return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération du HTML: {str(e)}")
            return None

    async def store_analysis(self, key: str, analysis: dict) -> None:
        """
        Stocke le résultat de l'analyse DeepSeek.
        
        Args:
            key: La clé Redis de l'offre (raw_html:url)
            analysis: Le dictionnaire contenant l'analyse
        """
        try:
            # Extrait l'URL de la clé raw_html:url
            url = key.split(":", 1)[1]
            
            # Ajoute l'URL à l'analyse
            analysis['URL'] = url
            
            # Stocke avec le préfixe analysis
            analysis_key = self._get_key(url, prefix="analysis")
            self.redis.set(
                analysis_key,
                str(analysis),  # Convertit le dict en str
                ex=CACHE_TTL
            )
            logger.debug(f"✅ Analyse stockée pour: {url}")
        except Exception as e:
            logger.error(f"❌ Erreur lors du stockage de l'analyse: {str(e)}")
            raise

    async def store_cleaned_html(self, key: str, cleaned_html: str) -> None:
        """
        Stocke le HTML nettoyé dans Redis.
        
        Args:
            key: La clé Redis de l'offre (raw_html:url)
            cleaned_html: Le contenu HTML nettoyé
        """
        try:
            cleaned_key = key.replace('raw_html:', 'cleaned_html:')
            self.redis.set(cleaned_key, cleaned_html, ex=CACHE_TTL)
            logger.debug(f"✅ HTML nettoyé stocké pour: {cleaned_key}")
        except Exception as e:
            logger.error(f"❌ Erreur lors du stockage du HTML nettoyé: {str(e)}")
            raise

    async def get_cleaned_html(self, key: str) -> Optional[str]:
        """
        Récupère le HTML nettoyé depuis Redis.
        
        Args:
            key: La clé Redis de l'offre (cleaned_html:url)
            
        Returns:
            Optional[str]: Le contenu HTML nettoyé ou None
        """
        try:
            content = self.redis.get(key)
            if content:
                logger.debug(f"✅ HTML nettoyé récupéré pour: {key}")
                return content
            return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération du HTML nettoyé: {str(e)}")
            return None

    async def get_all_cleaned_html_keys(self) -> list[str]:
        """
        Récupère toutes les clés des HTML nettoyés.
        
        Returns:
            list[str]: Liste des clés cleaned_html
        """
        try:
            pattern = self._get_key("*", prefix="cleaned_html")
            keys = self.redis.keys(pattern)
            logger.debug(f"✅ {len(keys)} clés cleaned_html trouvées")
            return keys
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération des clés cleaned_html: {str(e)}")
            return []

    async def get_all_analysis_keys(self) -> list[str]:
        """
        Récupère toutes les clés des analyses stockées.
        
        Returns:
            list[str]: Liste des clés analysis
        """
        try:
            pattern = self._get_key("*", prefix="analysis")
            keys = self.redis.keys(pattern)
            logger.debug(f"✅ {len(keys)} clés analysis trouvées")
            return keys
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération des clés analysis: {str(e)}")
            return []

    async def get_analysis(self, key: str) -> Optional[dict]:
        """
        Récupère une analyse depuis Redis.
        
        Args:
            key: La clé Redis de l'analyse (analysis:url)
            
        Returns:
            Optional[dict]: Le dictionnaire d'analyse ou None
        """
        try:
            content = self.redis.get(key)
            if content:
                logger.debug(f"✅ Analyse récupérée pour: {key}")
                return eval(content)  # Convertit la str en dict
            return None
        except Exception as e:
            logger.error(f"❌ Erreur lors de la récupération de l'analyse: {str(e)}")
            return None

    async def delete_analysis(self, key: str) -> bool:
        """
        Supprime une analyse de Redis après son chargement dans Supabase.
        
        Args:
            key: La clé Redis de l'analyse (analysis:url)
            
        Returns:
            bool: True si supprimé avec succès
        """
        try:
            deleted = self.redis.delete(key)
            if deleted:
                logger.debug(f"✅ Analyse supprimée: {key}")
                return True
            return False
        except Exception as e:
            logger.error(f"❌ Erreur lors de la suppression de l'analyse: {str(e)}")
            return False