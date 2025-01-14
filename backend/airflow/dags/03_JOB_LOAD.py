"""DAG Airflow pour le chargement des analyses d'offres d'emploi dans Supabase.
Ce DAG est responsable de :
1. Récupérer les analyses depuis Redis
2. Les charger dans Supabase
"""

import asyncio
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from loguru import logger
import sys
import os

# Configuration avancée du logger
logger.remove()  # Retire les handlers par défaut

# Log dans un fichier dédié
log_file = os.path.join("/opt/airflow/logs/app_logs", f"load_detailed_{datetime.now().strftime('%Y-%m-%d')}.log")
logger.add(
    log_file,
    rotation="500 MB",
    retention="10 days",
    level="DEBUG",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | {message}",
    enqueue=True,  # Thread-safe
    backtrace=True,  # Détails des erreurs
    diagnose=True,  # Informations de diagnostic
    mode="a"  # Mode append
)

# Log aussi dans stderr pour Airflow
logger.add(
    sys.stderr,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}",
    level="INFO",
    backtrace=True,
    diagnose=True
)

# Ajout du chemin du projet au PYTHONPATH
sys.path.append("/opt/airflow/")

from backend.scraper.core.cache import JobCache
from backend.scraper.core.storage import JobStorage
from backend.scraper.config.settings import SCRAPING_INTERVAL

# Configuration par défaut du DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=1)
}

async def load_analyses():
    """
    Charge les analyses d'offres d'emploi depuis Redis vers Supabase.
    """
    try:
        # Initialisation des composants
        cache = JobCache()
        storage = JobStorage()
        
        logger.info("📤 Début du chargement des analyses vers Supabase")
        
        # Récupération des clés des analyses
        analysis_keys = await cache.get_all_analysis_keys()
        logger.info(f"📊 {len(analysis_keys)} analyses à charger")
        
        # Compteurs pour les statistiques
        success_count = 0
        failure_count = 0
        
        # Traitement de chaque analyse
        for key in analysis_keys:
            try:
                # Récupération de l'analyse depuis Redis
                analysis = await cache.get_analysis(key)
                if not analysis:
                    logger.warning(f"⚠️ Analyse non trouvée pour {key}")
                    failure_count += 1
                    continue
                
                # Extraction de l'URL depuis la clé Redis (format: analysis:URL)
                logger.debug(f"🔍 Clé Redis: {key}")
                try:
                    # La clé est au format "analysis:https://www.free-work.com/..."
                    url = key.split("analysis:", 1)[1]
                    if not url:
                        logger.error(f"❌ URL non trouvée dans la clé: {key}")
                        failure_count += 1
                        continue
                    logger.debug(f"🔗 URL extraite: {url}")
                    analysis['URL'] = url
                except Exception as e:
                    logger.error(f"❌ Erreur lors de l'extraction de l'URL depuis {key}: {str(e)}")
                    failure_count += 1
                    continue
                
                # Conversion de DURATION_DAYS en None si c'est "None"
                if analysis.get('DURATION_DAYS') == "None":
                    analysis['DURATION_DAYS'] = None
                
                # Chargement dans Supabase
                success = await storage.store_job_analysis(analysis)
                if success:
                    success_count += 1
                    logger.success(f"✅ Analyse chargée avec succès : {key}")
                    # Suppression de l'analyse de Redis après chargement réussi
                    await cache.delete_analysis(key)
                else:
                    failure_count += 1
                    logger.error(f"❌ Échec du chargement de l'analyse : {key}")
                
            except Exception as e:
                failure_count += 1
                logger.exception(f"❌ Erreur lors du chargement de {key}: {str(e)}")
        
        # Log des statistiques finales
        logger.success(
            "📊 Bilan du chargement:\n"
            f"  - Analyses à charger: {len(analysis_keys)}\n"
            f"  - Chargements réussis: {success_count}\n"
            f"  - Échecs: {failure_count}"
        )
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale lors du chargement: {str(e)}")
        raise
    finally:
        cache.close()

def run_load_analyses():
    """Point d'entrée pour Airflow qui exécute la fonction de chargement."""
    asyncio.run(load_analyses())

# Création du DAG
dag = DAG(
    'DATA_PIPELINE.03_JOB_LOAD',
    default_args=default_args,
    description='Chargement des analyses d\'offres d\'emploi dans Supabase',
    schedule_interval=SCRAPING_INTERVAL,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['load', 'supabase', 'step_03']
)

# Tâche de chargement
load_task = PythonOperator(
    task_id='load_analyses',
    python_callable=run_load_analyses,
    dag=dag
) 