# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from ETL01_EXTRACT import JobExtractor
from ETL02_TRANSFO import JobTransformer
from ETL03_LOAD import JobLoader
import logging
import asyncio  # Ajout pour gérer l'async

logger = logging.getLogger(__name__)

# Définir la région
options.set_global_options(region="europe-west9")

initialize_app()

@https_fn.on_call()
def analyze_job(req: https_fn.CallableRequest) -> dict:
    try:
        logger.debug("🚀 [1] Démarrage de analyze_job")
        logger.debug(f"📦 [2] Type de la requête : {type(req)}")
        logger.debug(f"🔐 [3] Auth : {req.auth}")
        
        if not req.auth:
            logger.error("🚫 Erreur d'authentification")
            raise https_fn.HttpsError('unauthenticated', 'Must be authenticated')

        url = req.data.get('url')
        if not url:
            logger.error("🚫 URL manquante")
            raise https_fn.HttpsError('invalid-argument', 'URL is required')
        
        logger.debug(f"🔗 URL reçue : {url}")

        # Utiliser asyncio.create_task pour les opérations async
        loader = JobLoader()
        
        # Les étapes synchrones
        extractor = JobExtractor()
        raw_data = extractor.extract(url)
        logger.debug(f"📊 Données extraites : {raw_data}")
        
        transformer = JobTransformer()
        transformed_data = transformer.transform(raw_data)
        logger.debug(f"✨ Données transformées : {transformed_data}")
        
        # L'étape de chargement (maintenant synchrone)
        logger.debug("💫 [4] Avant l'appel à loader.load")
        doc_id = loader.load(transformed_data, req.auth.uid)
        logger.debug(f"📎 [5] Type de doc_id : {type(doc_id)}")
        
        result = {
            "status": "success",
            "data": transformed_data,
            "url": url,
            "user_id": req.auth.uid,
            "doc_id": doc_id
        }
        logger.debug(f"🎁 [6] Type du résultat : {type(result)}")
        return result
        
    except Exception as e:
        logger.error(f"💥 Erreur : {str(e)}")
        logger.error(f"🔍 Type d'erreur : {type(e)}")
        logger.error(f"🔬 Dir de l'erreur : {dir(e)}")
        import traceback
        logger.error(f"📚 Traceback complet : {traceback.format_exc()}")
        raise  # Remonter l'erreur pour voir la stack trace complète