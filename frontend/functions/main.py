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

        # Initialiser la connexion à la base de données
        db = firestore.client()

        # Vérifier si l'URL existe déjà
        existing_offers = db.collection('offers').where('URL', '==', url).limit(1).get()
        
        if existing_offers:
            raise https_fn.HttpsError(
                'already-exists',
                'Cette offre a déjà été analysée'
            )

        # Si l'URL n'existe pas, continuer le flow normal
        extractor = JobExtractor()
        transformer = JobTransformer()
        loader = JobLoader()

        # Extraction et transformation des données
        data = extractor.extract(url)
        transformed_data = transformer.transform(data)
        
        # Sauvegarde
        offer_id = loader.load(transformed_data, req.auth.uid)
        
        return {
            'success': True,
            'offer_id': offer_id,
            'status': 'completed'
        }

    except https_fn.HttpsError:
        raise
    except Exception as e:
        raise https_fn.HttpsError('internal', str(e))