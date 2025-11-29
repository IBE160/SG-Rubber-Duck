import sys
import os
from pathlib import Path
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import subprocess
import time
import requests
import uvicorn
import asyncio
import threading

# Ensure the project root is on sys.path so `import backend` works when running tests from this folder.
ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Force SQLite test DB before importing the app so models create_all targets sqlite, not Postgres
TEST_DB_URL = "sqlite:///./ws_test.db"
os.environ["DATABASE_URL"] = TEST_DB_URL

from backend.database import Base
from backend.main import app, get_db

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session() -> Session:
    """
    Provide a transactional scope around a test.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    # Override the app's dependency
    app.dependency_overrides[get_db] = lambda: session
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()
    # Clear the override after the test
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def setup_test_db(db_session: Session):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


class TestServer(uvicorn.Server):
    """Uvicorn test server that runs in a separate thread."""
    def __init__(self, app, host, port):
        self._startup_done = asyncio.Event()
        config = uvicorn.Config(app, host=host, port=port, log_level="info")
        super().__init__(config)

    async def startup(self, sockets=None):
        await super().startup(sockets)
        self._startup_done.set()

    def run_in_thread(self):
        self.thread = threading.Thread(target=self.run, daemon=True)
        self.thread.start()

    async def wait_for_startup(self):
        await self._startup_done.wait()

    def stop(self):
        self.should_exit = True
        self.thread.join()

@pytest.fixture(scope="function")
async def live_server(db_session: Session):
    """
    Starts a FastAPI application with Uvicorn in a separate thread for testing.
    The server uses the same DB session as the test function.
    """
    host = "127.0.0.1"
    port = 8000
    base_url = f"http://{host}:{port}"
    
    # The db_session fixture already overrides the dependency
    server = TestServer(app, host, port)
    server.run_in_thread()
    await server.wait_for_startup()
    
    yield base_url
    
    server.stop()
