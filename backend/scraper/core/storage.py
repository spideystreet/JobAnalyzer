"""
Module de gestion du stockage des données dans Supabase.
"""

from typing import Dict, List
from loguru import logger
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from ..core.enums import ExperienceLevel

# Chargement des variables d'environnement
load_dotenv()

# Récupération des informations de connexion Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class JobStorage:
    """
    Gère le stockage des données dans Supabase.
    """
    
    def __init__(self):
        """
        Initialise la connexion à Supabase.
        """
        try:
            self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("✅ Connexion à Supabase établie")
        except Exception as e:
            logger.error(f"❌ Erreur lors de la connexion à Supabase : {str(e)}")
            raise
    
    def _convert_arrays_to_postgres(self, analysis: Dict) -> Dict:
        """
        Convertit les tableaux Python en format PostgreSQL.
        """
        converted = analysis.copy()
        
        # Conversion des tableaux connus
        array_fields = ['CONTRACT_TYPE', 'TECHNOS']
        for field in array_fields:
            if field in converted and converted[field]:
                values = []
                
                # Si c'est déjà une chaîne
                if isinstance(converted[field], str):
                    # On extrait les valeurs entre les accolades
                    raw_values = converted[field].strip('{}').split(',')
                    values = [v.strip() for v in raw_values if v.strip()]
                
                # Si c'est une liste
                elif isinstance(converted[field], list):
                    values = [str(v).strip() for v in converted[field]]
                
                # Si c'est une autre valeur
                else:
                    values = [str(converted[field]).strip()]
                
                # On s'assure que toutes les valeurs sont entre guillemets
                quoted_values = [f'"{v}"' for v in values]
                converted[field] = '{' + ','.join(quoted_values) + '}'
        
        return converted

    def _validate_and_fix_data(self, analysis: Dict) -> Dict:
        """
        Valide et corrige les données avant le stockage.
        
        1. Vérifie que XP correspond aux valeurs de l'énumération
        2. Gère les TJM pour les CDI
        """
        validated = analysis.copy()
        
        # 1. Validation de l'expérience avec l'énumération
        if 'XP' in validated:
            xp_value = validated['XP']
            valid_xp_values = {e.value: e.value for e in ExperienceLevel}
            if xp_value not in valid_xp_values:
                logger.error(f"❌ Valeur XP invalide trouvée : {xp_value}")
                logger.error(f"Les valeurs autorisées sont : {list(valid_xp_values.keys())}")
                validated['XP'] = None
        
        # 2. Gestion des TJM pour les CDI
        contract_types = validated.get('CONTRACT_TYPE', [])
        if isinstance(contract_types, str):
            contract_types = [contract_types]
            
        if 'CDI' in contract_types:
            # Si c'est un CDI, on vérifie si l'un des TJM semble être un salaire
            tjm_min = validated.get('TJM_MIN')
            tjm_max = validated.get('TJM_MAX')
            
            if (tjm_min and tjm_min > 2000) or (tjm_max and tjm_max > 2000):
                logger.info(f"💡 TJM suspects pour un CDI (MIN: {tjm_min}€, MAX: {tjm_max}€) - Mise à NULL des deux valeurs")
                validated['TJM_MIN'] = None
                validated['TJM_MAX'] = None
        
        return validated

    async def store_job_analysis(self, analysis: Dict) -> bool:
        """
        Stocke une analyse d'offre d'emploi dans Supabase.
        
        Args:
            analysis (Dict): Analyse de l'offre au format JSON
            
        Returns:
            bool: True si succès, False sinon
        """
        try:
            # Validation et correction des données
            validated_analysis = self._validate_and_fix_data(analysis)
            
            # Conversion des tableaux au format PostgreSQL
            postgres_analysis = self._convert_arrays_to_postgres(validated_analysis)
            
            # Insertion dans la table job_offers
            data = self.supabase.table('job_offers').insert(postgres_analysis).execute()
            logger.info(f"✅ Analyse stockée dans Supabase : {analysis.get('URL', 'URL inconnue')}")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur lors du stockage dans Supabase : {str(e)}")
            return False
    
    async def store_job_analyses(self, analyses: List[Dict]) -> tuple[int, int]:
        """
        Stocke plusieurs analyses d'offres d'emploi dans Supabase.
        
        Args:
            analyses (List[Dict]): Liste des analyses au format JSON
            
        Returns:
            tuple[int, int]: (nombre de succès, nombre d'échecs)
        """
        total_offers = len(analyses)
        success_count = 0
        failure_count = 0
        
        logger.info(f"🚀 Début du stockage de {total_offers} offres dans Supabase")
        
        for index, analysis in enumerate(analyses, 1):
            try:
                logger.info(f"📊 Traitement de l'offre {index}/{total_offers} ({(index/total_offers)*100:.1f}%)")
                stored = await self.store_job_analysis(analysis)
                if stored:
                    success_count += 1
                    logger.info(f"✅ Offre {index}/{total_offers} stockée avec succès")
                else:
                    failure_count += 1
                    logger.warning(f"⚠️ Échec du stockage de l'offre {index}/{total_offers}")
            except Exception as e:
                failure_count += 1
                logger.error(f"❌ Erreur lors du stockage de l'offre {index}/{total_offers} : {str(e)}")
        
        logger.info(
            f"\n📈 Bilan final du stockage :\n"
            f"  - Total des offres : {total_offers}\n"
            f"  - Succès : {success_count} ({(success_count/total_offers)*100:.1f}%)\n"
            f"  - Échecs : {failure_count} ({(failure_count/total_offers)*100:.1f}%)"
        )
        
        return success_count, failure_count 