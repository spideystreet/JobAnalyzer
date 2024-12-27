# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from ETL01_EXTRACT import JobExtractor
from ETL02_TRANSFO import JobTransformer
from ETL03_LOAD import JobLoader
import logging

logger = logging.getLogger(__name__)

# Définir la région
options.set_global_options(region="europe-west9")

initialize_app()

@https_fn.on_call()
def analyze_job(req: https_fn.CallableRequest) -> dict:
    try:
        if not req.auth:
            raise https_fn.HttpsError('unauthenticated', 'Must be authenticated')

        url = req.data.get('url')
        if not url:
            raise https_fn.HttpsError('invalid-argument', 'URL is required')

        # Vérifier si l'URL existe déjà
        db = firestore.client()
        existing_offers = db.collection('offers').where('URL', '==', url).limit(1).get()
        
        if existing_offers:
            return {
                'success': False,
                'error': 'Cette offre a déjà été analysée',
                'offer_id': existing_offers[0].id
            }

        # Si l'URL n'existe pas, continuer le flow normal
        extractor = JobExtractor()
        transformer = JobTransformer()
        loader = JobLoader()

        # Extract (synchrone maintenant)
        data = extractor.extract(url)  # Plus de await
        
        # Transform
        transformed_data = transformer.transform(data)
        
        # Load
        offer_id = loader.load(transformed_data, req.auth.uid)
        
        return {
            'success': True,
            'offer_id': offer_id
        }

    except Exception as e:
        logger.error(f"Error in analyze_job: {str(e)}")
        raise https_fn.HttpsError('internal', str(e))