"""
Module de nettoyage du HTML des offres d'emploi.
"""

from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional, Tuple
from loguru import logger

from ..config.settings import ALLOWED_TAGS, RELEVANT_CLASSES
from ..core.enums import CompanyType

class HTMLCleaner:
    """Nettoie et extrait les sections pertinentes du HTML."""

    def __init__(self):
        """Initialise le nettoyeur avec les paramètres de configuration."""
        self.allowed_tags = ALLOWED_TAGS + ['h1', 'h2', 'h3', 'span', 'div', 'p', 'ul', 'li', 'strong', 'em']
        self.relevant_classes = RELEVANT_CLASSES + [
            'job-title',
            'breadcrumb',
            'tag',
            'text-sm',
            'font-semibold',
            'line-clamp-2'
        ]
        self._stats = {
            'original_size': 0,
            'cleaned_size': 0,
            'scripts_removed': 0,
            'styles_removed': 0,
            'company_type': None,
            'company_name': None
        }

    @property
    def stats(self) -> Dict[str, Any]:
        """Retourne les statistiques du dernier nettoyage."""
        return self._stats

    def extract_company_info(self, soup: BeautifulSoup) -> Tuple[Optional[str], Optional[str]]:
        """
        Extrait les informations de l'entreprise du HTML.
        """
        try:
            # Recherche dans les div avec flex items-center
            company_div = soup.find('div', class_='flex items-center')
            if company_div:
                # Extraction du type d'entreprise
                company_type_span = company_div.find('span', class_='tag')
                company_type = company_type_span.text.strip() if company_type_span else None
                
                # Extraction du nom de l'entreprise (en excluant Free-Work)
                company_name = None
                company_title = company_div.find('h1') or company_div.find('h2') or company_div.find('h3')
                if company_title:
                    name = company_title.text.strip()
                    if name.lower() != 'free-work':
                        company_name = name
                
                # Si pas trouvé, chercher dans les métadonnées
                if not company_name:
                    meta_company = soup.find('meta', property='og:site_name')
                    if meta_company:
                        name = meta_company['content'].strip()
                        if name.lower() != 'free-work':
                            company_name = name
                
                logger.debug(f"🏢 Informations entreprise extraites - Nom: {company_name}, Type: {company_type}")
                return company_type, company_name
            
            logger.warning("⚠️ Div entreprise non trouvé")
            return None, None
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'extraction des informations de l'entreprise : {str(e)}")
            return None, None

    def clean(self, html_content: str) -> str:
        """
        Nettoie le HTML en conservant uniquement les sections pertinentes.
        
        Args:
            html_content: Le HTML brut à nettoyer
            
        Returns:
            str: Le HTML nettoyé
        """
        try:
            # 1. Parse le HTML
            soup = self._create_soup(html_content)
            if not soup:
                return ''
                
            # 2. Extrait les informations de l'entreprise AVANT le nettoyage
            self.extract_company_info(soup)
            
            # 3. Crée une copie du soup pour le nettoyage
            soup_for_cleaning = BeautifulSoup(str(soup), 'lxml')
            
            # 4. Supprime les éléments non désirés
            self._remove_unwanted_elements(soup_for_cleaning)
            
            # 5. Extrait les sections pertinentes
            clean_soup = self._extract_relevant_sections(soup_for_cleaning)
            
            # 6. Crée le document final
            cleaned_html = str(clean_soup)
            
            # 7. Met à jour les stats
            self._update_stats(len(html_content), len(cleaned_html))
            
            logger.success(f"✅ Nettoyage terminé : {len(cleaned_html):,} caractères (réduction de {self._get_reduction_percent():.1f}%)")
            return cleaned_html
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du nettoyage HTML: {str(e)}")
            return ''

    def _create_soup(self, html: str) -> Optional[BeautifulSoup]:
        """Crée un objet BeautifulSoup."""
        try:
            return BeautifulSoup(html, 'lxml')
        except Exception as e:
            logger.error(f"❌ Erreur lors du parsing HTML: {str(e)}")
            return None

    def _remove_unwanted_elements(self, soup: BeautifulSoup) -> None:
        """Supprime les scripts, styles et autres éléments non désirés."""
        # Supprime les scripts
        scripts = soup.find_all('script')
        for script in scripts:
            script.decompose()
        self._stats['scripts_removed'] = len(scripts)
        
        # Supprime les styles
        styles = soup.find_all('style')
        for style in styles:
            style.decompose()
        self._stats['styles_removed'] = len(styles)

    def _extract_relevant_sections(self, soup: BeautifulSoup) -> BeautifulSoup:
        """Extrait uniquement les sections pertinentes du HTML."""
        # Crée une nouvelle soupe pour le contenu nettoyé
        clean_soup = BeautifulSoup('<div class="cleaned-content"></div>', 'lxml')
        content_div = clean_soup.find('div', class_='cleaned-content')
        
        # Conserve les éléments importants
        important_elements = []
        
        # Titres
        important_elements.extend(soup.find_all(['h1', 'h2', 'h3']))
        
        # Tags et labels
        important_elements.extend(soup.find_all(class_='tag'))
        
        # Informations clés (salaire, expérience, etc.)
        important_elements.extend(soup.find_all(class_='line-clamp-2'))
        
        # Description et contenu principal
        for class_name in self.relevant_classes:
            elements = soup.find_all(class_=class_name)
            important_elements.extend(elements)
            
        # Ajoute les éléments au contenu nettoyé
        for element in important_elements:
            if element:
                # Nettoie les attributs tout en gardant les classes importantes
                for tag in element.find_all(True):
                    allowed_attrs = ['class'] if tag.name in self.allowed_tags else []
                    attrs = dict(tag.attrs)
                    for attr in attrs:
                        if attr not in allowed_attrs:
                            del tag[attr]
                            
                content_div.append(element)
                
        return clean_soup

    def _get_section(self, soup: BeautifulSoup, class_name: str) -> Optional[Any]:
        """Extrait une section spécifique du HTML."""
        section = soup.find(class_=class_name)
        if section:
            # Nettoie les attributs
            for tag in section.find_all(True):
                allowed_attrs = ['class'] if tag.name in self.allowed_tags else []
                attrs = dict(tag.attrs)
                for attr in attrs:
                    if attr not in allowed_attrs:
                        del tag[attr]
            return section
        return None

    def _update_stats(self, original_size: int, cleaned_size: int) -> None:
        """Met à jour les statistiques de nettoyage."""
        self._stats['original_size'] = original_size
        self._stats['cleaned_size'] = cleaned_size

    def _get_reduction_percent(self) -> float:
        """Calcule le pourcentage de réduction de taille."""
        if self._stats['original_size'] == 0:
            return 0
        return 100 * (1 - self._stats['cleaned_size'] / self._stats['original_size']) 