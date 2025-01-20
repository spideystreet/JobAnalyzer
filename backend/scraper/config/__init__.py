"""
Config package contenant les configurations du scraper.
"""

from .settings import (
    DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL,
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
    "DEEPSEEK_API_KEY",
    "DEEPSEEK_BASE_URL",
    "DEEPSEEK_MODEL",
    "HTTP_TIMEOUT",
    "MAX_RETRIES",
    "RETRY_DELAY",
    "LOG_LEVEL",
    "LOG_FORMAT",
    "ALLOWED_TAGS",
    "RELEVANT_CLASSES",
    "REQUIRED_FIELDS"
] 