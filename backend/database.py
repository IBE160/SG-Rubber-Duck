from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Try configured DB, fall back to SQLite if missing or unreachable
engine = None
if DATABASE_URL:
    try:
        test_engine = create_engine(DATABASE_URL)
        with test_engine.connect() as _:
            pass
        engine = test_engine
    except OperationalError:
        print("DATABASE_URL not reachable. Falling back to local SQLite app.db")

if engine is None:
    DATABASE_URL = "sqlite:///./app.db"
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
