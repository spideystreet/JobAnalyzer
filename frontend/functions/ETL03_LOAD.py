import logging
from typing import Dict, Any
from firebase_admin import firestore
from datetime import datetime

logger = logging.getLogger(__name__)

class JobLoader:
    def __init__(self):
        self.db = firestore.client()
        self.offers_ref = self.db.collection('offers')

    def load(self, data: Dict[str, Any], user_id: str) -> str:
        """Version synchrone du chargement."""
        try:
            logger.debug("🔄 Début du chargement")
            
            # Vérifier si l'offre existe
            existing_offers = self.offers_ref.where('URL', '==', data['URL']).limit(1).get()
            
            if len(existing_offers) > 0:
                offer_ref = existing_offers[0].reference
                offer_ref.update({
                    'UPDATED_AT': datetime.now(),
                    'HISTORY': firestore.ArrayUnion([{
                        'TIMESTAMP': datetime.now(),
                        'DATA': data
                    }])
                })
                return offer_ref.id
            
            # Création d'une nouvelle offre
            new_offer = {
                'URL': data['URL'],
                'CREATED_AT': datetime.now(),
                'UPDATED_AT': datetime.now(),
                'USER_ID': user_id,
                'STATUS': 'ACTIVE',
                'TITLE': data['TITLE'],
                'COMPANY': data['COMPANY'],
                'COMPANY_TYPE': data['COMPANY_TYPE'],
                'CONTRACT_TYPE': data['CONTRACT_TYPE'],
                'LOCATION': {
                    'COUNTRY': data['COUNTRY'],
                    'REGION': data['REGION'],
                    'CITY': data['CITY']
                },
                'EXPERIENCE': {
                    'MIN': data['EXPERIENCE_MIN'],
                    'MAX': data['EXPERIENCE_MAX']
                },
                'SALARY': {
                    'MIN': data['DAILY_MIN'],
                    'MAX': data['DAILY_MAX']
                },
                'REMOTE': data['REMOTE'],
                'TECHNOS': data['TECHNOS'],
                'DURATION': data['DURATION_DAYS'],
                'HISTORY': [{
                    'TIMESTAMP': datetime.now(),
                    'DATA': data
                }]
            }
            
            # Ajout dans Firestore
            doc_ref = self.offers_ref.add(new_offer)
            logger.debug(f"✅ Nouvelle offre créée : {doc_ref[1].id}")
            return doc_ref[1].id

        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement: {str(e)}")
            raise 