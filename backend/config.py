"""
Lightweight settings without external dependency on pydantic-settings (offline-friendly).
"""
from dataclasses import dataclass
import os

@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "IBE160 Simulator Backend")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    app_description: str = os.getenv("APP_DESCRIPTION", "Backend for IBE160 Project Simulator")
    debug_mode: bool = os.getenv("DEBUG_MODE", "false").lower() == "true"
    # Placeholder DB URL (to be extended in later stories)
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

settings = Settings()
