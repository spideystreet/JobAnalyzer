"""
Configuration et initialisation du logger.
"""

import os
from loguru import logger
from functools import partial

from ..config.settings import (
    LOG_DIR,
    LOG_CONFIG
)

def error_filter(record):
    """Ajoute des métadonnées aux logs d'erreur."""
    if record["level"].name == "ERROR":
        record["extra"]["alert"] = True
    return True

def setup_logger():
    """Configure et initialise le logger."""
    # Crée le dossier de logs s'il n'existe pas
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    # Supprime les handlers par défaut
    logger.remove()
    
    # Configure les handlers selon la config
    for name, handler_config in LOG_CONFIG.items():
        # Ajoute le filtre pour les erreurs au handler fichier
        if name == "file":
            handler_config["filter"] = error_filter
        logger.add(**handler_config)
    
    logger.info("✅ Logger initialisé avec succès")
    return logger 