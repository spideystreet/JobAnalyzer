from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, HttpUrl

from ..value_objects.enums import JobDomain, JobStatus, RemoteType, CompanyType

class AIAnalysis(BaseModel):
    score: Dict[str, float] = Field(
        default_factory=dict,
        description="Scores de l'analyse (matching, salary_range)"
    )
    analysis: Dict[str, str] = Field(
        default_factory=dict,
        description="Analyse détaillée (niveau, type de projet, etc)"
    )
    market_insights: Dict[str, str] = Field(
        default_factory=dict,
        description="Insights sur le marché"
    )
    flags: Dict[str, bool | List[str]] = Field(
        default_factory=dict,
        description="Drapeaux importants (urgent, red flags, etc)"
    )

class JobOffer(BaseModel):
    """
    Représente une offre d'emploi avec toutes ses caractéristiques.
    Cette entité est le cœur de notre domaine métier.
    """
    id: Optional[str] = Field(None, description="UUID de l'offre")
    title: str = Field(..., description="Titre du poste")
    company: str = Field(..., description="Nom de l'entreprise")
    company_type: CompanyType = Field(..., description="Type d'entreprise")
    domain: JobDomain = Field(..., description="Domaine principal")
    skills: List[str] = Field(default_factory=list, description="Liste des compétences")
    tjm_min: Optional[int] = Field(None, description="TJM minimum")
    tjm_max: Optional[int] = Field(None, description="TJM maximum")
    city: Optional[str] = Field(None, description="Ville")
    region: Optional[str] = Field(None, description="Région")
    country: str = Field(default="France", description="Pays")
    remote: Optional[RemoteType] = Field(None, description="Type de remote")
    url: HttpUrl = Field(..., description="URL de l'offre")
    ai_analysis: Optional[AIAnalysis] = Field(None, description="Analyse IA")
    status: JobStatus = Field(default=JobStatus.NEW, description="Statut de l'offre")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 