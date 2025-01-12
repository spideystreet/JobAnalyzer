"""
DAG Airflow pour le scraping quotidien des offres d'emploi.
"""

import asyncio
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from loguru import logger

from backend.scraper.core.list_scraper import JobListScraper
from backend.scraper.core.job_scraper import JobScraper
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

async def process_jobs():
    """
    Fonction principale qui gère le processus de scraping.
    Récupère toutes les nouvelles offres et les analyse.
    """
    try:
        # Initialisation des composants
        list_scraper = JobListScraper()
        job_scraper = JobScraper()
        cache = JobCache()
        
        logger.info("🚀 Début du processus de scraping")
        
        # Récupère toutes les URLs
        urls = await list_scraper.get_all_job_urls()
        logger.info(f"📑 {len(urls)} offres trouvées au total")
        
        # Compteurs pour les statistiques
        processed = 0
        skipped = 0
        failed = 0
        
        # Traite chaque URL
        for url in urls:
            try:
                # Vérifie si l'URL a déjà été traitée
                if await cache.is_processed(url):
                    logger.debug(f"⏭️ URL déjà traitée: {url}")
                    skipped += 1
                    continue
                
                # Scrape et analyse l'offre
                job_data = await job_scraper.scrape_job_offer(url)
                
                if job_data:
                    # TODO: Sauvegarder dans Supabase
                    await cache.mark_processed(url)
                    processed += 1
                    logger.success(f"✅ Offre traitée: {url}")
                else:
                    failed += 1
                    logger.error(f"❌ Échec du traitement: {url}")
                    
            except Exception as e:
                failed += 1
                logger.exception(f"❌ Erreur lors du traitement de {url}: {str(e)}")
        
        # Log des statistiques finales
        logger.success(
            "📊 Bilan du scraping:\n"
            f"  - Offres trouvées: {len(urls)}\n"
            f"  - Traitées avec succès: {processed}\n"
            f"  - Déjà vues: {skipped}\n"
            f"  - Échecs: {failed}"
        )
        
    except Exception as e:
        logger.exception(f"❌ Erreur fatale: {str(e)}")
        raise
    finally:
        # Ferme la connexion Redis
        cache.close()

def run_scraping():
    """Point d'entrée pour Airflow qui exécute la fonction asynchrone."""
    asyncio.run(process_jobs())

# Création du DAG
dag = DAG(
    'job_scraping',
    default_args=default_args,
    description='Scraping quotidien des offres d\'emploi',
    schedule_interval=SCRAPING_INTERVAL,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['scraping', 'jobs']
)

# Tâche de scraping
scraping_task = PythonOperator(
    task_id='scrape_new_jobs',
    python_callable=run_scraping,
    dag=dag
)

# Si on ajoute d'autres tâches plus tard, on peut définir les dépendances ici
# Par exemple : scraping_task >> notification_task 