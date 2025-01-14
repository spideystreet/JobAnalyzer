from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class Country(str, Enum):
    FRANCE = "France"
    BELGIQUE = "Belgique"
    LUXEMBOURG = "Luxembourg"
    SUISSE = "Suisse"

class FrenchRegion(str, Enum):
    ILE_DE_FRANCE = "Île-de-France"
    AUVERGNE_RHONE_ALPES = "Auvergne-Rhône-Alpes"
    HAUTS_DE_FRANCE = "Hauts-de-France"
    PROVENCE_ALPES_COTE_AZUR = "Provence-Alpes-Côte d'Azur"
    OCCITANIE = "Occitanie"
    NOUVELLE_AQUITAINE = "Nouvelle-Aquitaine"
    GRAND_EST = "Grand Est"
    PAYS_DE_LA_LOIRE = "Pays de la Loire"
    NORMANDIE = "Normandie"
    BRETAGNE = "Bretagne"
    BOURGOGNE_FRANCHE_COMTE = "Bourgogne-Franche-Comté"
    CENTRE_VAL_DE_LOIRE = "Centre-Val de Loire"
    CORSE = "Corse"

class BelgianRegion(str, Enum):
    BRUXELLES_CAPITALE = "Bruxelles-Capitale"
    WALLONIE = "Wallonie"
    FLANDRE = "Flandre"

class SwissRegion(str, Enum):
    GENEVE = "Genève"
    VAUD = "Vaud"
    ZURICH = "Zürich"
    BERNE = "Berne"
    BALE = "Bâle"
    TESSIN = "Tessin"
    VALAIS = "Valais"
    FRIBOURG = "Fribourg"
    NEUCHATEL = "Neuchâtel"
    JURA = "Jura"
    LUCERNE = "Lucerne"
    SAINT_GALL = "Saint-Gall"

# Luxembourg n'a pas de régions administratives, c'est un petit pays

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

class ExperienceLevel(str, Enum):
    JUNIOR = "Junior"
    INTERMEDIAIRE = "Intermédiaire"
    CONFIRME = "Confirmé"
    SENIOR = "Sénior"

class CompanyType(str, Enum):
    ESN = "ESN"
    STARTUP = "Startup"
    GRAND_COMPTE = "Grand Compte"
    CABINET_CONSEIL = "Cabinet de Conseil"
    SCALE_UP = "Scale-up"
    CABINET_RECRUTEMENT = "Cabinet de recrutement"

class ContractType(str, Enum):
    FREELANCE = "Freelance"
    CDI = "CDI"
    CDD = "CDD"
    STAGE = "Stage"
    ALTERNANCE = "Alternance"

class JobOffer(BaseModel):
    ID: Optional[str] = None
    TITLE: str
    COUNTRY: Optional[Country] = None
    REGION: Optional[str] = None  # On garde en str car la région dépend du pays
    CITY: Optional[str] = None
    COMPANY: Optional[str] = None
    COMPANY_TYPE: Optional[CompanyType] = None
    CONTRACT_TYPE: ContractType
    XP: Optional[ExperienceLevel] = None
    DOMAIN: JobDomain
    TECHNOS: List[str]
    TJM_MIN: Optional[int] = None
    TJM_MAX: Optional[int] = None
    DURATION_DAYS: Optional[int] = None
    REMOTE: RemoteType
    URL: str
    STATUS: JobStatus = JobStatus.NEW
    AI_ANALYSIS: Optional[dict] = None
    CREATED_AT: datetime = datetime.utcnow()
    UPDATED_AT: datetime = datetime.utcnow()
