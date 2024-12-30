# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from ETL01_EXTRACT import JobExtractor
from ETL02_TRANSFO import JobTransformer
from ETL03_LOAD import JobLoader
import logging
import time
from flask import Request

# Configuration du logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Définir la région
options.set_global_options(region="europe-west9")

initialize_app()

@https_fn.on_call(
    timeout_sec=540
)
def analyze_job(req: https_fn.CallableRequest) -> dict:
    """
    Cloud Function pour analyser une offre d'emploi.
    Accepte uniquement les requêtes POST avec un payload contenant une URL.
    """
    start_time = time.time()

    # Log pour le warm start (exécution normale)
    logger.info("🚀 Démarrage de l'analyse (warm start)")

    try:
        # Vérifier l'authentification
        if not req.auth:
            logger.warning("❌ Authentication failed")
            raise https_fn.HttpsError('unauthenticated', 'Must be authenticated')

        # Vérifier la méthode et les données
        if not isinstance(req.data, dict):
            logger.warning("❌ Invalid request format")
            raise https_fn.HttpsError('invalid-argument', 'Invalid request data format')

        url = req.data.get('url')
        if not url:
            logger.warning("❌ No URL provided")
            raise https_fn.HttpsError('invalid-argument', 'URL is required')

        logger.info(f"📝 Processing URL: {url}")

        # Initialiser les composants ETL
        logger.info("🔧 Initializing ETL components")
        extractor = JobExtractor()
        transformer = JobTransformer()
        loader = JobLoader()

        # Extraction et transformation des données
        logger.info("🔍 Starting data extraction")
        data = extractor.extract(url)
        logger.info("🔄 Starting data transformation")
        transformed_data = transformer.transform(data)
        
        # Sauvegarde
        logger.info("💾 Starting data loading")
        offer_id = loader.load(transformed_data, req.auth.uid)
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Analysis completed in {execution_time:.2f} seconds")
        
        return {
            'success': True,
            'offer_id': offer_id,
            'status': 'completed',
            'execution_time': execution_time
        }

    except https_fn.HttpsError:
        logger.error("❌ HTTP Error occurred", exc_info=True)
        raise
    except Exception as e:
        logger.error(f"❌ Error processing URL: {str(e)}", exc_info=True)
        raise https_fn.HttpsError('internal', str(e))