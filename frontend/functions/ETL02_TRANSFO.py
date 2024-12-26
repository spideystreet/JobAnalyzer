import logging
import unicodedata
from typing import Dict, Any, List
import json

logger = logging.getLogger(__name__)

class JobTransformer:
    # Liste des acronymes à ne pas modifier
    TECH_ACRONYMS = {'GCP', 'AWS', 'SQL', 'API', 'ETL', 'CLI', 'SDK'}
    
    # Mapping de standardisation des technos
    TECH_MAPPING = {
        'MICROSOFT POWERBI': 'POWER_BI',
        'POWER BI': 'POWER_BI',
        'POWERBI': 'POWER_BI',
        'AZURE DATABRICKS': 'DATABRICKS',
        'MS AZURE': 'AZURE',
        'MICROSOFT AZURE': 'AZURE',
        # Ajouter d'autres mappings au besoin
    }

    # Champs qui doivent être des entiers
    NUMERIC_FIELDS = {
        'DAILY_MIN', 'DAILY_MAX', 
        'EXPERIENCE_MIN', 'EXPERIENCE_MAX',
        'DURATION_DAYS'
    }

    def transform(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Transforme les données extraites en format standardisé."""
        try:
            logger.debug("🔄 Début de la transformation")
            
            transformed = {}
            for key, value in data.items():
                if key == 'URL':  # Ne pas transformer les URLs
                    transformed[key] = value
                elif key == 'TECHNOS':
                    transformed[key] = self._normalize_technos(value)
                elif key in self.NUMERIC_FIELDS:
                    transformed[key] = self._convert_to_int(value)
                else:
                    transformed[key] = self._normalize_text(value)
            
            logger.debug(f"✨ Données transformées : {json.dumps(transformed, indent=2, ensure_ascii=False)}")
            return transformed
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la transformation: {str(e)}")
            raise

    def _normalize_text(self, value: Any) -> Any:
        """Normalise le texte (majuscules, sans accents)."""
        if isinstance(value, str):
            # Convertir en majuscules et supprimer les accents
            normalized = unicodedata.normalize('NFKD', value.upper())
            normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
            return normalized
        elif isinstance(value, list):
            return [self._normalize_text(item) for item in value]
        return value

    def _normalize_technos(self, technos: List[str]) -> List[str]:
        """Normalise la liste des technologies."""
        normalized = []
        for tech in technos:
            # Convertir en majuscules
            tech = tech.upper()
            
            # Vérifier si c'est un acronyme
            if tech in self.TECH_ACRONYMS:
                normalized.append(tech)
                continue
                
            # Appliquer le mapping de standardisation
            tech = tech.replace(' ', '_')
            tech = self.TECH_MAPPING.get(tech, tech)
            
            normalized.append(tech)
            
        return normalized 

    def _convert_to_int(self, value: Any) -> int:
        """Convertit une valeur en entier si possible."""
        if not value:  # Si vide ou None
            return 0
        try:
            return int(value)
        except (ValueError, TypeError):
            return 0 