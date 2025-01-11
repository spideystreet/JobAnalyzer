from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class JobDomain(str, Enum):
    DATA = "DATA"
    FULLSTACK = "FULLSTACK"
    WEB3 = "WEB3"
    IA = "IA"
    MOBILE = "MOBILE"
    AUTRE = "AUTRE"

class RemoteType(str, Enum):
    FULL = "100%"
    HYBRID = "HYBRID"
    OFFICE = "OFFICE"

class JobStatus(str, Enum):
    NEW = "NEW"
    ANALYZED = "ANALYZED"
    ARCHIVED = "ARCHIVED"

class JobOffer(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    description: str
    domain: JobDomain
    skills: List[str]
    tjm_min: Optional[int] = None
    tjm_max: Optional[int] = None
    city: str
    region: Optional[str] = None
    country: str
    remote: RemoteType
    url: str
    status: JobStatus = JobStatus.NEW
    ai_analysis: Optional[dict] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
