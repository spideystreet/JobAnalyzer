"""
Package scraper pour l'analyse d'offres d'emploi.
"""

from .core.job_scraper import JobScraper
from .core.html_cleaner import HTMLCleaner
from .core.job_analyzer import JobAnalyzer

__version__ = "1.0.0"
__author__ = "JobAnalyzer Team"

__all__ = [
    "JobScraper",
    "HTMLCleaner",
    "JobAnalyzer"
]
