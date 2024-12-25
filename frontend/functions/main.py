# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app

# Définir la région
options.set_global_options(region="europe-west9")

initialize_app()

@https_fn.on_call()
def analyze_job(req: https_fn.CallableRequest) -> dict:
    try:
        print("Fonction analyze_job appelée !")
        
        if not req.auth:
            print("Erreur : utilisateur non authentifié")
            raise https_fn.HttpsError('unauthenticated', 'Must be authenticated')

        url = req.data.get('url')
        if not url:
            print("Erreur : URL manquante")
            raise https_fn.HttpsError('invalid-argument', 'URL is required')

        print(f"Analyse de l'URL : {url}")
        
        return {
            "status": "success",
            "url": url,
            "user_id": req.auth.uid
        }
    except Exception as e:
        print(f"Erreur inattendue : {str(e)}")
        raise