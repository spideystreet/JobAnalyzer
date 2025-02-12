"""
Énumérations pour le typage des données.
"""

from enum import Enum, auto
from typing import Union, List

class CompanyType(str, Enum):
    """Type d'entreprise."""
    STARTUP = "Startup"
    ESN = "ESN"
    GRAND_COMPTE = "Grand Compte"
    CABINET_CONSEIL = "Cabinet de Conseil"
    SCALE_UP = "Scale-up"
    CABINET_RECRUTEMENT = "Cabinet de recrutement"

class ContractType(str, Enum):
    """Type de contrat."""
    FREELANCE = "Freelance"
    CDI = "CDI"
    CDD = "CDD"
    STAGE = "Stage"
    ALTERNANCE = "Alternance"

class JobDomain(str, Enum):
    """Domaine du poste."""
    # Développement Web
    FULLSTACK = "Fullstack"
    FRONTEND = "Frontend"
    BACKEND = "Backend"
    
    # Data
    DATA_ENGINEER = "Data Engineer"
    DATA_SCIENTIST = "Data Scientist"
    DATA_ANALYST = "Data Analyst"
    ML_ENGINEER = "ML Engineer"
    
    # Infrastructure & Cloud
    DEVOPS = "DevOps"
    CLOUD = "Cloud"

    # Mobile & Apps
    MOBILE = "Mobile"
    
    # Sécurité
    CYBERSECURITY = "Cybersécurité"
    PENTESTER = "Pentester"
    
    # Qualité & Tests
    QA_ENGINEER = "QA Engineer"
    TEST_AUTOMATION = "Test Automation Engineer"
    PERFORMANCE_ENGINEER = "Performance Engineer"
    
    # Management & Product
    TECH_LEAD = "Tech Lead"
    PRODUCT_MANAGER = "Product Manager"
    PRODUCT_OWNER = "Product Owner"
    SCRUM_MASTER = "Scrum Master"
    
    # Autres spécialisations
    BLOCKCHAIN = "Blockchain Developer"
    GAME_DEV = "Game Developer"
    LOW_LEVEL = "Low Level Developer"

class ExperienceLevel(str, Enum):
    """Niveau d'expérience requis."""
    JUNIOR = "Junior"
    INTERMEDIAIRE = "Intermédiaire"
    CONFIRME = "Confirmé"
    SENIOR = "Sénior"

    @classmethod
    def from_years(cls, years: int) -> 'ExperienceLevel':
        """Convertit un nombre d'années d'expérience en niveau."""
        if years < 2:
            return cls.JUNIOR
        elif years < 5:
            return cls.INTERMEDIAIRE
        elif years < 8:
            return cls.CONFIRME
        else:
            return cls.SENIOR

class RemoteType(str, Enum):
    """Type de travail à distance."""
    FULL = "100%"
    HYBRID = "Hybride"
    OFFICE = "Non"

class Country(str, Enum):
    """Pays du poste."""
    FRANCE = "France"
    BELGIQUE = "Belgique"
    LUXEMBOURG = "Luxembourg"
    SUISSE = "Suisse"

class FranceRegion(str, Enum):
    """Régions de France."""
    AUVERGNE_RHONE_ALPES = "Auvergne-Rhône-Alpes"
    BOURGOGNE_FRANCHE_COMTE = "Bourgogne-Franche-Comté"
    BRETAGNE = "Bretagne"
    CENTRE_VAL_DE_LOIRE = "Centre-Val de Loire"
    CORSE = "Corse"
    GRAND_EST = "Grand Est"
    HAUTS_DE_FRANCE = "Hauts-de-France"
    ILE_DE_FRANCE = "Île-de-France"
    NORMANDIE = "Normandie"
    NOUVELLE_AQUITAINE = "Nouvelle-Aquitaine"
    OCCITANIE = "Occitanie"
    PAYS_DE_LA_LOIRE = "Pays de la Loire"
    PROVENCE_ALPES_COTE_AZUR = "Provence-Alpes-Côte d'Azur"
    DOM_TOM = "DOM-TOM"

class BelgiqueRegion(str, Enum):
    """Régions de Belgique."""
    BRUXELLES_CAPITALE = "Bruxelles-Capitale"
    FLANDRE = "Flandre"
    WALLONIE = "Wallonie"

class SuisseRegion(str, Enum):
    """Régions de Suisse (Cantons principaux)."""
    GENEVE = "Genève"
    VAUD = "Vaud"
    ZURICH = "Zürich"
    BERNE = "Berne"
    BALE = "Bâle"
    TESSIN = "Tessin"
    VALAIS = "Valais"
    FRIBOURG = "Fribourg"
    NEUCHATEL = "Neuchâtel"
    SAINT_GALL = "Saint-Gall"
    LUCERNE = "Lucerne"
    ARGOVIE = "Argovie"

class LuxembourgRegion(str, Enum):
    """Régions du Luxembourg."""
    LUXEMBOURG_VILLE = "Luxembourg-Ville"
    DIEKIRCH = "Diekirch"
    GREVENMACHER = "Grevenmacher"

RegionType = Union[FranceRegion, BelgiqueRegion, SuisseRegion, LuxembourgRegion]

def get_regions_by_country(country: Country) -> List[str]:
    """Retourne toutes les régions d'un pays donné."""
    region_map = {
        Country.FRANCE: FranceRegion,
        Country.BELGIQUE: BelgiqueRegion,
        Country.SUISSE: SuisseRegion,
        Country.LUXEMBOURG: LuxembourgRegion
    }
    region_class = region_map.get(country)
    if not region_class:
        return []
    return [region.value for region in region_class]

def get_all_regions() -> List[str]:
    """Retourne toutes les régions de tous les pays."""
    all_regions = []
    for country in Country:
        all_regions.extend(get_regions_by_country(country))
    return all_regions 