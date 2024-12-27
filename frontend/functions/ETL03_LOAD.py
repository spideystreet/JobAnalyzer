import logging
from typing import Dict, Any
from firebase_admin import firestore
from datetime import datetime

logger = logging.getLogger(__name__)

class JobLoader:
    def __init__(self):
        self.db = firestore.client()
        self.offers_ref = self.db.collection('offers')

    def load(self, data: dict, user_id: str) -> str:
        try:
            # Structure de base de l'offre
            new_offer = {
                # Métadonnées
                'URL': data['URL'],
                'CREATED_AT': datetime.now(),
                'USER_ID': user_id,
                'STATUS': 'ACTIVE',
                'TITLE': data['TITLE'],
                
                # Données entreprise
                'COMPANY': {
                    'NAME': data['COMPANY'],
                    'TYPE': data['COMPANY_TYPE'],
                },
                
                # Informations contrat
                'CONTRACT_TYPE': data['CONTRACT_TYPE'],
                'DURATION': data['DURATION_DAYS'],
                
                # Localisation
                'LOCATION': {
                    'COUNTRY': data['COUNTRY'],
                    'REGION': data['REGION'],
                    'CITY': data['CITY'],
                    'REMOTE': data['REMOTE'],
                },
                
                # Critères
                'EXPERIENCE': {
                    'MIN': data['EXPERIENCE_MIN'],
                    'MAX': data['EXPERIENCE_MAX']
                },
                'SALARY': {
                    'MIN': data['DAILY_MIN'],
                    'MAX': data['DAILY_MAX']
                },
                
                # Technologies
                'TECHNOS': data['TECHNOS']
            }
            
            # Créer une nouvelle offre
            doc_ref = self.offers_ref.document()
            doc_ref.set(new_offer)
            return doc_ref.id

        except Exception as e:
            logging.error(f"Error in load: {str(e)}")
            raise e 