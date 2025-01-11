import os
from pathlib import Path
from dotenv import load_dotenv

# Chargement des variables d'environnement
load_dotenv()

# Chemins
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Configuration de l'application
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Configuration Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Configuration OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GPT_MODEL = "gpt-3.5-turbo"

# Configuration Scraping
SCRAPING_INTERVAL_HOURS = 24
MAX_OFFERS_PER_DAY = 50
REQUEST_TIMEOUT = 30
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_PERIOD = 60  # en secondes

# URLs FreeWork
FREEWORK_BASE_URL = "https://www.free-work.com/fr/tech-it"
FREEWORK_API_URL = "https://api.free.work/v1"
FREEWORK_LOGIN_URL = f"{FREEWORK_BASE_URL}/auth/login"
FREEWORK_SEARCH_URL = f"{FREEWORK_BASE_URL}/search/missions"

# Headers par défaut
DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Origin": FREEWORK_BASE_URL,
    "Referer": FREEWORK_BASE_URL
} 