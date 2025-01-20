from typing import List, Optional
from supabase import create_client, Client
from loguru import logger

from ...models.entities.job_offer import JobOffer
from ..config.settings import SUPABASE_URL, SUPABASE_KEY

class SupabaseClient:
    """
    Client Supabase utilisant le pattern Singleton pour garantir
    une seule instance de connexion.
    """
    _instance = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._client is None:
            try:
                self._client = create_client(SUPABASE_URL, SUPABASE_KEY)
                logger.info("Connexion Supabase établie")
            except Exception as e:
                logger.error(f"Erreur de connexion Supabase: {str(e)}")
                raise

    async def create_job_offer(self, job_offer: JobOffer) -> str:
        """Crée une nouvelle offre d'emploi."""
        try:
            data = job_offer.model_dump(exclude={'id'})
            result = self._client.table('JOB_OFFERS').insert(data).execute()
            
            if len(result.data) > 0:
                return result.data[0]['id']
            raise Exception("Aucun ID retourné après insertion")
            
        except Exception as e:
            logger.error(f"Erreur lors de la création de l'offre: {str(e)}")
            raise

    async def get_job_offer(self, job_id: str) -> Optional[JobOffer]:
        """Récupère une offre par son ID."""
        try:
            result = self._client.table('JOB_OFFERS').select("*").eq('id', job_id).execute()
            
            if len(result.data) > 0:
                return JobOffer(**result.data[0])
            return None
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération de l'offre {job_id}: {str(e)}")
            raise

    async def get_job_offers(self, limit: int = 100, status: Optional[str] = None) -> List[JobOffer]:
        """Récupère une liste d'offres avec filtres optionnels."""
        try:
            query = self._client.table('JOB_OFFERS').select("*").limit(limit)
            
            if status:
                query = query.eq('status', status)
            
            result = query.execute()
            return [JobOffer(**item) for item in result.data]
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des offres: {str(e)}")
            raise

    async def update_job_offer(self, job_id: str, job_offer: JobOffer) -> bool:
        """Met à jour une offre existante."""
        try:
            data = job_offer.model_dump(exclude={'id'})
            result = self._client.table('JOB_OFFERS').update(data).eq('id', job_id).execute()
            
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Erreur lors de la mise à jour de l'offre {job_id}: {str(e)}")
            raise

    async def delete_job_offer(self, job_id: str) -> bool:
        """Supprime une offre."""
        try:
            result = self._client.table('JOB_OFFERS').delete().eq('id', job_id).execute()
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Erreur lors de la suppression de l'offre {job_id}: {str(e)}")
            raise

    async def get_offers_by_domain(self, domain: str, limit: int = 100) -> List[JobOffer]:
        """Récupère les offres par domaine."""
        try:
            result = self._client.table('JOB_OFFERS').select("*").eq('domain', domain).limit(limit).execute()
            return [JobOffer(**item) for item in result.data]
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des offres du domaine {domain}: {str(e)}")
            raise 