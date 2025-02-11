"""
Config package contenant les configurations du scraper.
"""

from .settings import (
    MISTRAL_API_KEY,
    MISTRAL_MODEL,
    HTTP_TIMEOUT,
    MAX_RETRIES,
    RETRY_DELAY,
    LOG_LEVEL,
    LOG_FORMAT,
    ALLOWED_TAGS,
    RELEVANT_CLASSES,
    REQUIRED_FIELDS
)

__all__ = [
    "MISTRAL_API_KEY",
    "MISTRAL_MODEL",
    "HTTP_TIMEOUT",
    "MAX_RETRIES",
    "RETRY_DELAY",
    "LOG_LEVEL",
    "LOG_FORMAT",
    "ALLOWED_TAGS",
    "RELEVANT_CLASSES",
    "REQUIRED_FIELDS"
] 