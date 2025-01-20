import pytest
from unittest.mock import Mock, patch
from datetime import datetime
from uuid import uuid4

from backend.infrastructure.database.supabase import SupabaseClient
from backend.models.entities.job_offer import JobOffer
from backend.models.value_objects.enums import JobDomain, CompanyType, JobStatus, RemoteType

# Fixtures pour les tests
@pytest.fixture
def mock_supabase():
    """Mock du client Supabase."""
    with patch('backend.infrastructure.database.supabase.create_client') as mock:
        yield mock

@pytest.fixture
def sample_job_offer():
    """Crée une offre d'emploi de test."""
    return JobOffer(
        id=str(uuid4()),
        title="Dev Python Senior",
        company="Tech Corp",
        company_type=CompanyType.ESN,
        domain=JobDomain.FULLSTACK,
        skills=["Python", "FastAPI", "React"],
        tjm_min=600,
        tjm_max=800,
        city="Paris",
        region="Île-de-France",
        country="France",
        remote=RemoteType.FULL,
        url="https://example.com/job",
        status=JobStatus.NEW,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

@pytest.mark.asyncio
async def test_create_job_offer(mock_supabase, sample_job_offer):
    """Test la création d'une offre."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [{"id": "123"}]
    mock_supabase.return_value.table.return_value.insert.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    job_id = await client.create_job_offer(sample_job_offer)
    
    # Assert
    assert job_id == "123"
    mock_supabase.return_value.table.assert_called_with("JOB_OFFERS")
    mock_supabase.return_value.table.return_value.insert.assert_called_once()

@pytest.mark.asyncio
async def test_get_job_offer(mock_supabase, sample_job_offer):
    """Test la récupération d'une offre."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [sample_job_offer.model_dump()]
    mock_supabase.return_value.table.return_value.select.return_value.eq.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    job = await client.get_job_offer("123")
    
    # Assert
    assert job.title == sample_job_offer.title
    assert job.company == sample_job_offer.company
    assert job.domain == sample_job_offer.domain

@pytest.mark.asyncio
async def test_get_job_offers_with_status(mock_supabase, sample_job_offer):
    """Test la récupération des offres avec filtre de status."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [sample_job_offer.model_dump()]
    mock_supabase.return_value.table.return_value.select.return_value.limit.return_value.eq.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    jobs = await client.get_job_offers(status=JobStatus.NEW)
    
    # Assert
    assert len(jobs) == 1
    assert jobs[0].status == JobStatus.NEW
    mock_supabase.return_value.table.return_value.select.assert_called_with("*")

@pytest.mark.asyncio
async def test_update_job_offer(mock_supabase, sample_job_offer):
    """Test la mise à jour d'une offre."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [{"id": "123"}]
    mock_supabase.return_value.table.return_value.update.return_value.eq.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    success = await client.update_job_offer("123", sample_job_offer)
    
    # Assert
    assert success is True
    mock_supabase.return_value.table.return_value.update.assert_called_once()

@pytest.mark.asyncio
async def test_delete_job_offer(mock_supabase):
    """Test la suppression d'une offre."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [{"id": "123"}]
    mock_supabase.return_value.table.return_value.delete.return_value.eq.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    success = await client.delete_job_offer("123")
    
    # Assert
    assert success is True
    mock_supabase.return_value.table.return_value.delete.assert_called_once()

@pytest.mark.asyncio
async def test_get_offers_by_domain(mock_supabase, sample_job_offer):
    """Test la récupération des offres par domaine."""
    # Setup
    mock_execute = Mock()
    mock_execute.execute.return_value.data = [sample_job_offer.model_dump()]
    mock_supabase.return_value.table.return_value.select.return_value.eq.return_value.limit.return_value = mock_execute

    client = SupabaseClient()
    
    # Execute
    jobs = await client.get_offers_by_domain(JobDomain.FULLSTACK)
    
    # Assert
    assert len(jobs) == 1
    assert jobs[0].domain == JobDomain.FULLSTACK 