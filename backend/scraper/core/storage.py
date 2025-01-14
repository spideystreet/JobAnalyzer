"""
Module de gestion du stockage des données dans Supabase.
"""

from typing import Dict, List
from loguru import logger
from supabase import create_client, Client
import os
from dotenv import load_dotenv

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
    
    async def store_job_analysis(self, analysis: Dict) -> bool:
        """
        Stocke une analyse d'offre d'emploi dans Supabase.
        
        Args:
            analysis (Dict): Analyse de l'offre au format JSON
            
        Returns:
            bool: True si succès, False sinon
        """
        try:
            # Insertion dans la table job_offers
            data = self.supabase.table('job_offers').insert(analysis).execute()
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
        success_count = 0
        failure_count = 0
        
        for analysis in analyses:
            try:
                stored = await self.store_job_analysis(analysis)
                if stored:
                    success_count += 1
                else:
                    failure_count += 1
            except Exception as e:
                failure_count += 1
                logger.error(f"❌ Erreur lors du stockage d'une analyse : {str(e)}")
        
        return success_count, failure_count 