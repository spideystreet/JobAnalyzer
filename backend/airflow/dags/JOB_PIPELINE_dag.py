"""
DAG Airflow unifié pour le pipeline complet de traitement des offres d'emploi.
Combine les trois étapes :
1. Extraction (Scraping)
2. Transformation et Analyse
3. Chargement dans Supabase
"""

import asyncio
from datetime import datetime, timedelta
import os
import sys
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.log.logging_mixin import LoggingMixin
from loguru import logger
from bs4 import BeautifulSoup

# Configuration avancée du logger
logger.remove()  # Retire les handlers par défaut

# Log dans un fichier dédié
log_file = os.path.join("/opt/airflow/logs/app_logs", f"job_pipeline_{datetime.now().strftime('%Y-%m-%d')}.log")
logger.add(
    log_file,
    rotation="500 MB",
    retention="10 days",
    level="DEBUG",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | {message}",
    enqueue=True,
    backtrace=True,
    diagnose=True,
    mode="a"
)

# Log dans stdout pour Airflow
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}",
    level="INFO",
    backtrace=True,
    diagnose=True
)

# Import des composants nécessaires
from backend.scraper.core.list_scraper import JobListScraper
from backend.scraper.core.cache import JobCache
from backend.scraper.core.html_cleaner import HTMLCleaner
from backend.scraper.core.job_analyzer import JobAnalyzer
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
    'execution_timeout': timedelta(hours=2)
}

# Création d'un logger Airflow
airflow_logger = LoggingMixin().log

async def extract_jobs():
    """
    Étape 1: Extraction des offres d'emploi
    """
    try:
        list_scraper = JobListScraper()
        cache = JobCache()
        
        airflow_logger.info("🚀 Début de l'extraction")
        
        try:
            urls = await list_scraper.get_all_job_urls()
            airflow_logger.info(f"📑 {len(urls)} offres trouvées au total")
        except Exception as e:
            airflow_logger.error(f"❌ Erreur lors de la récupération des URLs: {str(e)}")
            raise
        
        extracted = 0
        skipped = 0
        failed = 0
        
        for url in urls:
            try:
                if await cache.is_processed(url):
                    airflow_logger.debug(f"⏭️ URL déjà extraite: {url}")
                    skipped += 1
                    continue
                
                html_content = await list_scraper._fetch_page(url)
                
                if html_content:
                    await cache.store_raw_html(url, html_content)
                    extracted += 1
                    airflow_logger.info(f"✅ HTML extrait: {url}")
                else:
                    failed += 1
                    airflow_logger.error(f"❌ Échec de l'extraction: {url}")
                    
            except Exception as e:
                failed += 1
                airflow_logger.error(f"❌ Erreur lors de l'extraction de {url}: {str(e)}")
        
        airflow_logger.info(
            "📊 Bilan de l'extraction:\n"
            f"  - Offres trouvées: {len(urls)}\n"
            f"  - HTML extraits: {extracted}\n"
            f"  - Déjà vus: {skipped}\n"
            f"  - Échecs: {failed}"
        )
        
    except Exception as e:
        airflow_logger.error(f"❌ Erreur fatale: {str(e)}")
        raise
    finally:
        cache.close()

async def transform_and_analyze():
    """
    Étape 2: Transformation et analyse des offres
    """
    try:
        cache = JobCache()
        cleaner = HTMLCleaner()
        analyzer = JobAnalyzer()
        
        # Partie 1: Nettoyage HTML
        airflow_logger.info("🧹 Début du nettoyage HTML")
        raw_keys = await cache.get_all_raw_html_keys()
        airflow_logger.info(f"📑 {len(raw_keys)} offres à nettoyer")
        
        cleaned = 0
        cleaning_failed = 0
        
        for key in raw_keys:
            try:
                html_content = await cache.get_raw_html(key)
                if not html_content:
                    airflow_logger.warning(f"⚠️ HTML non trouvé pour {key}")
                    cleaning_failed += 1
                    continue
                
                # Nettoyage du HTML
                cleaned_html = cleaner.clean(html_content)
                
                await cache.store_cleaned_html(key, cleaned_html)
                cleaned += 1
                airflow_logger.info(f"✅ Nettoyage réussi: {key}")
                    
            except Exception as e:
                cleaning_failed += 1
                airflow_logger.error(f"❌ Erreur lors du nettoyage de {key}: {str(e)}")
        
        # Partie 2: Analyse
        airflow_logger.info("🧠 Début de l'analyse")
        cleaned_keys = await cache.get_all_cleaned_html_keys()
        airflow_logger.info(f"📑 {len(cleaned_keys)} offres à analyser")
        
        analyzed = 0
        analysis_failed = 0
        
        for key in cleaned_keys:
            try:
                cleaned_html = await cache.get_cleaned_html(key)
                if not cleaned_html:
                    airflow_logger.warning(f"⚠️ HTML nettoyé non trouvé pour {key}")
                    analysis_failed += 1
                    continue
                
                # Analyse simplifiée
                analysis = await analyzer.analyze(cleaned_html, key)
                
                if analysis:
                    await cache.store_analysis(key, analysis)
                    analyzed += 1
                    airflow_logger.info(f"✅ Analyse réussie: {key}")
                else:
                    analysis_failed += 1
                    airflow_logger.error(f"❌ Échec de l'analyse: {key}")
                    
            except Exception as e:
                analysis_failed += 1
                airflow_logger.error(f"❌ Erreur lors de l'analyse de {key}: {str(e)}")
        
        airflow_logger.info(
            "📊 Bilan de la transformation:\n"
            f"  - Nettoyages réussis: {cleaned}/{len(raw_keys)}\n"
            f"  - Analyses réussies: {analyzed}/{len(cleaned_keys)}\n"
            f"  - Échecs nettoyage: {cleaning_failed}\n"
            f"  - Échecs analyse: {analysis_failed}"
        )
        
    except Exception as e:
        airflow_logger.error(f"❌ Erreur fatale lors de la transformation: {str(e)}")
        raise
    finally:
        cache.close()

async def load_to_supabase():
    """
    Étape 3: Chargement des analyses dans Supabase
    """
    try:
        cache = JobCache()
        storage = JobStorage()
        
        airflow_logger.info("📤 Début du chargement des analyses vers Supabase")
        
        analysis_keys = await cache.get_all_analysis_keys()
        airflow_logger.info(f"📊 {len(analysis_keys)} analyses à charger")
        
        success_count = 0
        failure_count = 0
        
        for key in analysis_keys:
            try:
                analysis = await cache.get_analysis(key)
                if not analysis:
                    airflow_logger.warning(f"⚠️ Analyse non trouvée pour {key}")
                    failure_count += 1
                    continue
                
                # Extraction de l'URL depuis la clé
                url = key.split("analysis:", 1)[1] if "analysis:" in key else None
                if not url:
                    airflow_logger.error(f"❌ URL non trouvée dans la clé: {key}")
                    failure_count += 1
                    continue
                
                analysis['URL'] = url
                
                # Nettoyage des valeurs None
                if analysis.get('DURATION_DAYS') == "None":
                    analysis['DURATION_DAYS'] = None
                
                # Assurer que CONTRACT_TYPE est une liste
                contract_type = analysis.get('CONTRACT_TYPE')
                if contract_type:
                    if isinstance(contract_type, str):
                        analysis['CONTRACT_TYPE'] = [contract_type]
                    elif not isinstance(contract_type, list):
                        analysis['CONTRACT_TYPE'] = [str(contract_type)]
                else:
                    analysis['CONTRACT_TYPE'] = []
                
                # Stockage dans Supabase
                success = await storage.store_job_analysis(analysis)
                if success:
                    success_count += 1
                    airflow_logger.info(f"✅ Analyse chargée avec succès : {key}")
                    await cache.delete_analysis(key)
                else:
                    failure_count += 1
                    airflow_logger.error(f"❌ Échec du chargement de l'analyse : {key}")
                
            except Exception as e:
                failure_count += 1
                airflow_logger.error(f"❌ Erreur lors du chargement de {key}: {str(e)}")
                airflow_logger.exception("Détails de l'erreur:")
        
        airflow_logger.info(
            "📊 Bilan du chargement:\n"
            f"  - Analyses à charger: {len(analysis_keys)}\n"
            f"  - Chargements réussis: {success_count}\n"
            f"  - Échecs: {failure_count}"
        )
        
    except Exception as e:
        airflow_logger.error(f"❌ Erreur fatale lors du chargement: {str(e)}")
        raise
    finally:
        cache.close()

def run_extract():
    """Point d'entrée pour l'extraction"""
    airflow_logger.info("🚀 Début de l'extraction des offres...")
    try:
        asyncio.run(extract_jobs())
        airflow_logger.info("✅ Extraction terminée avec succès")
    except Exception as e:
        airflow_logger.error(f"❌ Erreur lors de l'extraction: {str(e)}")
        raise

def run_transform():
    """Point d'entrée pour la transformation"""
    airflow_logger.info("🔄 Début de la transformation et analyse...")
    try:
        asyncio.run(transform_and_analyze())
        airflow_logger.info("✅ Transformation et analyse terminées avec succès")
    except Exception as e:
        airflow_logger.error(f"❌ Erreur lors de la transformation: {str(e)}")
        raise

def run_load():
    """Point d'entrée pour le chargement"""
    airflow_logger.info("📤 Début du chargement vers Supabase...")
    try:
        asyncio.run(load_to_supabase())
        airflow_logger.info("✅ Chargement terminé avec succès")
    except Exception as e:
        airflow_logger.error(f"❌ Erreur lors du chargement: {str(e)}")
        raise

# Création du DAG
dag = DAG(
    'DATA_PIPELINE.JOB_PIPELINE',
    default_args=default_args,
    description='Pipeline complet de traitement des offres d\'emploi',
    schedule_interval=SCRAPING_INTERVAL,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['pipeline', 'extract', 'transform', 'load']
)

# Tâches
extract_task = PythonOperator(
    task_id='extract_jobs',
    python_callable=run_extract,
    dag=dag
)

transform_task = PythonOperator(
    task_id='transform_and_analyze',
    python_callable=run_transform,
    dag=dag
)

load_task = PythonOperator(
    task_id='load_to_supabase',
    python_callable=run_load,
    dag=dag
)

# Définition de l'ordre des tâches
extract_task >> transform_task >> load_task