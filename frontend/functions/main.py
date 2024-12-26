# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from ETL01_EXTRACT import JobExtractor
import logging
import sys

# Configuration des logs
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout  # Force l'affichage sur stdout
)

logger = logging.getLogger(__name__)

# Définir la région
options.set_global_options(region="europe-west9")

initialize_app()

@https_fn.on_call()
def analyze_job(req: https_fn.CallableRequest) -> dict:
    try:
        logger.debug("🎯 Fonction analyze_job appelée")
        
        if not req.auth:
            logger.error("❌ Utilisateur non authentifié")
            raise https_fn.HttpsError('unauthenticated', 'Must be authenticated')

        url = req.data.get('url')
        if not url:
            logger.error("❌ URL manquante")
            raise https_fn.HttpsError('invalid-argument', 'URL is required')

        logger.debug(f"🌐 URL reçue : {url}")
        
        logger.debug("🔧 Initialisation de JobExtractor...")
        extractor = JobExtractor()
        logger.debug("✅ JobExtractor initialisé")
        
        logger.debug("🚀 Démarrage de l'extraction...")
        job_data = extractor.extract(url)
        logger.debug(f"📊 Données extraites : {job_data}")
        
        return {
            "status": "success",
            "data": job_data,
            "url": url,
            "user_id": req.auth.uid
        }
    except Exception as e:
        logger.error(f"💥 Erreur : {str(e)}", exc_info=True)
        return {
            "status": "error",
            "error": str(e),
            "url": url
        }