"""
DAG Airflow pour la transformation et l'analyse des offres d'emploi.
1. Nettoyage du HTML brut
2. Analyse via DeepSeek
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
log_file = os.path.join("/opt/airflow/logs/app_logs", f"transform_detailed_{datetime.now().strftime('%Y-%m-%d')}.log")
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

from backend.scraper.core.cache import JobCache
from backend.scraper.core.html_cleaner import HTMLCleaner
from backend.scraper.core.job_analyzer import JobAnalyzer
from backend.scraper.config.settings import SCRAPING_INTERVAL

# Configuration par défaut du DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=2)
}

async def transform_html():
    """
    Fonction qui nettoie le HTML brut :
    1. Récupère le HTML brut depuis Redis
    2. Le nettoie
    3. Stocke la version nettoyée
    """
    try:
        # Initialisation des composants
        cache = JobCache()
        cleaner = HTMLCleaner()
        
        logger.info("🧹 Début du nettoyage HTML")
        
        # Récupère toutes les clés raw_html
        raw_keys = await cache.get_all_raw_html_keys()
        logger.info(f"📑 {len(raw_keys)} offres à nettoyer")
        
        # Compteurs pour les statistiques
        processed = 0
        failed = 0
        
        # Traite chaque offre
        for key in raw_keys:
            try:
                # Récupère le HTML brut
                html_content = await cache.get_raw_html(key)
                if not html_content:
                    logger.warning(f"⚠️ HTML non trouvé pour {key}")
                    failed += 1
                    continue
                
                # Nettoie le HTML
                cleaned_html = cleaner.clean(html_content)
                
                # Stocke le HTML nettoyé
                await cache.store_cleaned_html(key, cleaned_html)
                processed += 1
                logger.success(f"✅ Nettoyage réussi: {key}")
                    
            except Exception as e:
                failed += 1
                logger.exception(f"❌ Erreur lors du nettoyage de {key}: {str(e)}")
        
        # Log des statistiques finales
        logger.success(
            "📊 Bilan du nettoyage:\n"
            f"  - Offres à nettoyer: {len(raw_keys)}\n"
            f"  - Nettoyages réussis: {processed}\n"
            f"  - Échecs: {failed}"
        )
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale lors du nettoyage: {str(e)}")
        raise
    finally:
        cache.close()

async def analyze_jobs():
    """
    Fonction qui analyse les offres nettoyées :
    1. Récupère le HTML nettoyé
    2. L'analyse avec DeepSeek
    3. Stocke le résultat
    """
    try:
        # Initialisation des composants
        cache = JobCache()
        analyzer = JobAnalyzer()
        
        logger.info("🧠 Début de l'analyse")
        
        # Récupère toutes les clés des HTML nettoyés
        cleaned_keys = await cache.get_all_cleaned_html_keys()
        logger.info(f"📑 {len(cleaned_keys)} offres à analyser")
        
        # Compteurs pour les statistiques
        processed = 0
        failed = 0
        
        # Traite chaque offre
        for key in cleaned_keys:
            try:
                # Récupère le HTML nettoyé
                cleaned_html = await cache.get_cleaned_html(key)
                if not cleaned_html:
                    logger.warning(f"⚠️ HTML nettoyé non trouvé pour {key}")
                    failed += 1
                    continue
                
                # Analyse avec DeepSeek
                analysis = await analyzer.analyze(cleaned_html)
                
                if analysis:
                    # Stocke le résultat
                    await cache.store_analysis(key, analysis)
                    processed += 1
                    logger.success(f"✅ Analyse réussie: {key}")
                else:
                    failed += 1
                    logger.error(f"❌ Échec de l'analyse: {key}")
                    
            except Exception as e:
                failed += 1
                logger.exception(f"❌ Erreur lors de l'analyse de {key}: {str(e)}")
        
        # Log des statistiques finales
        logger.success(
            "📊 Bilan de l'analyse:\n"
            f"  - Offres à analyser: {len(cleaned_keys)}\n"
            f"  - Analyses réussies: {processed}\n"
            f"  - Échecs: {failed}"
        )
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale lors de l'analyse: {str(e)}")
        raise
    finally:
        cache.close()

def run_transform_html():
    """Point d'entrée pour Airflow qui exécute la fonction de transformation."""
    asyncio.run(transform_html())

def run_analyze_jobs():
    """Point d'entrée pour Airflow qui exécute la fonction d'analyse."""
    asyncio.run(analyze_jobs())

# Création du DAG
dag = DAG(
    'DATA_PIPELINE.02_JOB_TRANSFO',
    default_args=default_args,
    description='Transformation et analyse des offres d\'emploi',
    schedule_interval=SCRAPING_INTERVAL,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['transformation', 'analysis', 'step_02']
)

# Tâche de transformation HTML
transform_task = PythonOperator(
    task_id='transform_html',
    python_callable=run_transform_html,
    dag=dag
)

# Tâche d'analyse
analyze_task = PythonOperator(
    task_id='analyze_jobs',
    python_callable=run_analyze_jobs,
    dag=dag
)

# Définition de l'ordre des tâches
transform_task >> analyze_task 