from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

def _make_engine(url: str):
    """Create SQLAlchemy engine with SQLite-specific args when needed."""
    if url.startswith("sqlite"):
        # check_same_thread=False is needed for SQLite with FastAPI/asyncio
        return create_engine(url, connect_args={"check_same_thread": False})
    return create_engine(url)

# Prefer explicit DATABASE_URL; fall back to local SQLite for dev/test
# Enable WAL mode for better concurrency with SQLite by adding it to the URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db?pragma=journal_mode%3DWAL")
engine = _make_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
