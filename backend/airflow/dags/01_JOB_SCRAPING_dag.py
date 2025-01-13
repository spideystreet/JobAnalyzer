"""
DAG Airflow pour l'extraction des offres d'emploi.
"""

import asyncio
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from loguru import logger

from backend.scraper.core.list_scraper import JobListScraper
from backend.scraper.core.cache import JobCache
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

async def extract_jobs():
    """
    Fonction d'extraction pure qui :
    1. Récupère les URLs des offres
    2. Extrait le HTML brut
    3. Stocke dans Redis
    """
    try:
        # Initialisation des composants
        list_scraper = JobListScraper()
        cache = JobCache()
        
        logger.info("🚀 Début de l'extraction")
        
        try:
            # Récupère toutes les URLs
            urls = await list_scraper.get_all_job_urls()
            logger.info(f"📑 {len(urls)} offres trouvées au total")
        except Exception as e:
            logger.exception(f"❌ Erreur lors de la récupération des URLs: {str(e)}")
            raise
        
        # Compteurs pour les statistiques
        extracted = 0
        skipped = 0
        failed = 0
        
        # Traite chaque URL
        for url in urls:
            try:
                # Vérifie si l'URL a déjà été traitée
                if await cache.is_processed(url):
                    logger.debug(f"⏭️ URL déjà extraite: {url}")
                    skipped += 1
                    continue
                
                # Extrait uniquement le HTML brut
                html_content = await list_scraper._fetch_page(url)
                
                if html_content:
                    # Stocke le HTML brut dans Redis
                    await cache.store_raw_html(url, html_content)
                    extracted += 1
                    logger.success(f"✅ HTML extrait: {url}")
                else:
                    failed += 1
                    logger.error(f"❌ Échec de l'extraction: {url}")
                    
            except Exception as e:
                failed += 1
                logger.exception(f"❌ Erreur lors de l'extraction de {url}: {str(e)}")
        
        # Log des statistiques finales
        logger.success(
            "📊 Bilan de l'extraction:\n"
            f"  - Offres trouvées: {len(urls)}\n"
            f"  - HTML extraits: {extracted}\n"
            f"  - Déjà vus: {skipped}\n"
            f"  - Échecs: {failed}"
        )
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale: {str(e)}")
        raise
    finally:
        # Ferme la connexion Redis
        cache.close()

def run_extraction():
    """Point d'entrée pour Airflow qui exécute la fonction asynchrone."""
    asyncio.run(extract_jobs())

# Création du DAG
dag = DAG(
    'DATA_PIPELINE.01_JOB_SCRAPING',
    default_args=default_args,
    description='Extraction quotidienne du HTML des offres d\'emploi',
    schedule_interval=SCRAPING_INTERVAL,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['ingestion', 'scraping', 'extract', 'step_01']
)

# Tâche d'extraction
extraction_task = PythonOperator(
    task_id='extract_job_html',
    python_callable=run_extraction,
    dag=dag
) 