"""
Module de gestion du stockage des données dans Supabase.
"""

from typing import Dict, List, Optional
from loguru import logger
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from ..core.enums import (
    ExperienceLevel, Country, get_regions_by_country, get_all_regions,
    CompanyType, ContractType, JobDomain, RemoteType,
    FranceRegion, BelgiqueRegion, SuisseRegion, LuxembourgRegion
)

# Chargement des variables d'environnement
load_dotenv()

# Récupération des informations de connexion Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Mapping des villes vers les régions de France
CITY_TO_REGION_MAPPING = {
    # Île-de-France
    "Paris": FranceRegion.ILE_DE_FRANCE.value,
    "Versailles": FranceRegion.ILE_DE_FRANCE.value,
    "Boulogne-Billancourt": FranceRegion.ILE_DE_FRANCE.value,
    
    # Auvergne-Rhône-Alpes
    "Lyon": FranceRegion.AUVERGNE_RHONE_ALPES.value,
    "Grenoble": FranceRegion.AUVERGNE_RHONE_ALPES.value,
    "Clermont-Ferrand": FranceRegion.AUVERGNE_RHONE_ALPES.value,
    
    # Provence-Alpes-Côte d'Azur
    "Marseille": FranceRegion.PROVENCE_ALPES_COTE_AZUR.value,
    "Nice": FranceRegion.PROVENCE_ALPES_COTE_AZUR.value,
    "Aix-en-Provence": FranceRegion.PROVENCE_ALPES_COTE_AZUR.value,
    
    # Occitanie
    "Toulouse": FranceRegion.OCCITANIE.value,
    "Montpellier": FranceRegion.OCCITANIE.value,
    
    # Nouvelle-Aquitaine
    "Bordeaux": FranceRegion.NOUVELLE_AQUITAINE.value,
    
    # Pays de la Loire
    "Nantes": FranceRegion.PAYS_DE_LA_LOIRE.value,
    
    # Hauts-de-France
    "Lille": FranceRegion.HAUTS_DE_FRANCE.value,
    
    # Grand Est
    "Strasbourg": FranceRegion.GRAND_EST.value,
    
    # Bretagne
    "Rennes": FranceRegion.BRETAGNE.value,
}

class JobStorage:
    """
    Gère le stockage des données dans Supabase.
    """
    
    def __init__(self):
        """
        Initialise la connexion à Supabase.
        """
        try:
            self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("✅ Connexion à Supabase établie")
        except Exception as e:
            logger.error(f"❌ Erreur lors de la connexion à Supabase : {str(e)}")
            raise
    
    def _clean_and_validate_region(self, region: Optional[str], country: Optional[str]) -> Optional[str]:
        """Nettoie et valide une région."""
        if not region:
            return None

        # Nettoyage basique
        region = region.strip()
        
        # Vérification dans le mapping des villes
        if region in CITY_TO_REGION_MAPPING:
            logger.info(f"🔄 Conversion ville -> région : {region} -> {CITY_TO_REGION_MAPPING[region]}")
            region = CITY_TO_REGION_MAPPING[region]

        # Validation selon le pays
        if country:
            try:
                valid_regions = get_regions_by_country(Country(country))
                if region in valid_regions:
                    return region
                logger.error(f"❌ Région '{region}' invalide pour {country}")
                logger.debug(f"Régions valides pour {country}: {valid_regions}")
                return None
            except ValueError:
                logger.error(f"❌ Pays invalide : {country}")
                return None
        else:
            # Si pas de pays spécifié, on vérifie dans toutes les régions
            all_regions = get_all_regions()
            if region in all_regions:
                return region
            logger.error(f"❌ Région '{region}' non trouvée dans la liste des régions valides")
            return None

    def _validate_company_type(self, company_type: Optional[str]) -> Optional[str]:
        """Valide le type d'entreprise."""
        if not company_type:
            return None
            
        try:
            return CompanyType(company_type).value
        except ValueError:
            logger.error(f"❌ Type d'entreprise invalide : {company_type}")
            logger.debug(f"Types valides : {[t.value for t in CompanyType]}")
            return None

    def _validate_contract_types(self, contract_types: List[str]) -> List[str]:
        """Valide les types de contrat."""
        if not contract_types:
            return []
            
        valid_types = []
        for contract_type in contract_types:
            try:
                valid_types.append(ContractType(contract_type).value)
            except ValueError:
                logger.error(f"❌ Type de contrat invalide : {contract_type}")
                logger.debug(f"Types valides : {[t.value for t in ContractType]}")
        return valid_types

    def _validate_job_domain(self, domain: Optional[str]) -> Optional[str]:
        """Valide le domaine du poste."""
        if not domain:
            return None
            
        try:
            return JobDomain(domain).value
        except ValueError:
            logger.error(f"❌ Domaine invalide : {domain}")
            logger.debug(f"Domaines valides : {[d.value for d in JobDomain]}")
            return None

    def _validate_remote_type(self, remote: Optional[str]) -> Optional[str]:
        """Valide le type de travail à distance."""
        if not remote:
            return None
            
        try:
            return RemoteType(remote).value
        except ValueError:
            logger.error(f"❌ Type de remote invalide : {remote}")
            logger.debug(f"Types valides : {[r.value for r in RemoteType]}")
            return None

    def _validate_and_fix_data(self, analysis: Dict) -> Dict:
        """
        Valide et corrige les données avant le stockage.
        
        1. Vérifie que XP correspond aux valeurs de l'énumération
        2. Gère les TJM pour les CDI
        3. Valide et corrige la région
        """
        validated = analysis.copy()
        
        # 1. Validation de l'expérience avec l'énumération
        if 'XP' in validated:
            xp_value = validated['XP']
            try:
                validated['XP'] = ExperienceLevel(xp_value).value
            except ValueError:
                logger.error(f"❌ Valeur XP invalide : {xp_value}")
                logger.debug(f"Valeurs autorisées : {[e.value for e in ExperienceLevel]}")
                validated['XP'] = None
        
        # 2. Gestion des TJM pour les CDI
        contract_types = validated.get('CONTRACT_TYPE', [])
        if isinstance(contract_types, str):
            contract_types = [contract_types]
            
        if 'CDI' in contract_types:
            # Si c'est un CDI, on vérifie si l'un des TJM semble être un salaire
            tjm_min = validated.get('TJM_MIN')
            tjm_max = validated.get('TJM_MAX')
            
            if (tjm_min and tjm_min > 2000) or (tjm_max and tjm_max > 2000):
                logger.info(f"💡 TJM suspects pour un CDI (MIN: {tjm_min}€, MAX: {tjm_max}€) - Mise à NULL des deux valeurs")
                validated['TJM_MIN'] = None
                validated['TJM_MAX'] = None

        # 3. Validation et correction de la région
        if 'REGION' in validated:
            validated['REGION'] = self._clean_and_validate_region(
                validated['REGION'],
                validated.get('COUNTRY')
            )
        
        # Validation du type d'entreprise
        if 'COMPANY_TYPE' in validated:
            validated['COMPANY_TYPE'] = self._validate_company_type(validated['COMPANY_TYPE'])
        
        # Validation des types de contrat
        if 'CONTRACT_TYPE' in validated:
            contract_types = validated['CONTRACT_TYPE']
            if isinstance(contract_types, str):
                contract_types = [contract_types]
            validated['CONTRACT_TYPE'] = self._validate_contract_types(contract_types)
        
        # Validation du domaine
        if 'DOMAIN' in validated:
            validated['DOMAIN'] = self._validate_job_domain(validated['DOMAIN'])
        
        # Validation du type de remote
        if 'REMOTE' in validated:
            validated['REMOTE'] = self._validate_remote_type(validated['REMOTE'])
        
        return validated

    async def store_job_analysis(self, analysis: Dict) -> bool:
        """
        Stocke une analyse d'offre d'emploi dans Supabase.
        
        Args:
            analysis (Dict): Analyse de l'offre au format JSON
            
        Returns:
            bool: True si succès, False sinon
        """
        try:
            # Validation et correction des données
            validated_analysis = self._validate_and_fix_data(analysis)
            
            # Insertion dans la table job_offers
            data = self.supabase.table('job_offers').insert(validated_analysis).execute()
            logger.info(f"✅ Analyse stockée dans Supabase : {analysis.get('URL', 'URL inconnue')}")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur lors du stockage dans Supabase : {str(e)}")
            return False
    
    async def store_job_analyses(self, analyses: List[Dict]) -> tuple[int, int]:
        """
        Stocke plusieurs analyses d'offres d'emploi dans Supabase.
        
        Args:
            analyses (List[Dict]): Liste des analyses au format JSON
            
        Returns:
            tuple[int, int]: (nombre de succès, nombre d'échecs)
        """
        total_offers = len(analyses)
        success_count = 0
        failure_count = 0
        
        logger.info(f"🚀 Début du stockage de {total_offers} offres dans Supabase")
        
        for index, analysis in enumerate(analyses, 1):
            try:
                logger.info(f"📊 Traitement de l'offre {index}/{total_offers} ({(index/total_offers)*100:.1f}%)")
                stored = await self.store_job_analysis(analysis)
                if stored:
                    success_count += 1
                    logger.info(f"✅ Offre {index}/{total_offers} stockée avec succès")
                else:
                    failure_count += 1
                    logger.warning(f"⚠️ Échec du stockage de l'offre {index}/{total_offers}")
            except Exception as e:
                failure_count += 1
                logger.error(f"❌ Erreur lors du stockage de l'offre {index}/{total_offers} : {str(e)}")
        
        logger.info(
            f"\n📈 Bilan final du stockage :\n"
            f"  - Total des offres : {total_offers}\n"
            f"  - Succès : {success_count} ({(success_count/total_offers)*100:.1f}%)\n"
            f"  - Échecs : {failure_count} ({(failure_count/total_offers)*100:.1f}%)"
        )
        
        return success_count, failure_count 