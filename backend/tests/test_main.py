import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app, get_db
from backend import models

# --- Test Database Setup (file-based SQLite to persist across connections) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    # Create tables before each test
    models.Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    # Drop tables after each test
    models.Base.metadata.drop_all(bind=engine)


# --- Tests ---

def test_create_project(client):
    response = client.post(
        "/projects/",
        json={"name": "Test Project", "description": "A test project", "budget": 100000, "start_date": "2025-01-01", "end_date": "2025-12-31"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Project"
    assert "id" in data

def test_read_projects(client):
    # First create a project to ensure the list is not empty
    client.post(
        "/projects/",
        json={"name": "Test Project", "description": "A test project", "budget": 100000, "start_date": "2025-01-01", "end_date": "2025-12-31"},
    )
    
    response = client.get("/projects/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "Test Project"

def test_create_task_for_project(client):
    # First, create a project to get a valid project_id
    project_response = client.post(
        "/projects/",
        json={"name": "Project for Tasks", "description": "A test project", "budget": 5000, "start_date": "2025-01-01", "end_date": "2025-01-31"},
    )
    project_id = project_response.json()["id"]

    # Now, create a task for that project
    task_response = client.post(
        f"/projects/{project_id}/tasks/",
        json={"text": "Test Task", "start_date": "2025-01-01", "duration": 5, "cost": 100, "dependencies": []},
    )
    assert task_response.status_code == 200
    data = task_response.json()
    assert data["text"] == "Test Task"
    assert data["project_id"] == project_id

def test_run_simulation_background(client):
    # Create a project and a task
    project_response = client.post(
        "/projects/",
        json={"name": "Sim Project", "description": "A test project", "budget": 10000, "start_date": "2025-02-01", "end_date": "2025-02-28"},
    )
    project_id = project_response.json()["id"]
    client.post(
        f"/projects/{project_id}/tasks/",
        json={"text": "Sim Task 1", "start_date": "2025-02-01", "duration": 10, "cost": 1000, "dependencies": []},
    )

    # Run the simulation
    response = client.post(f"/projects/{project_id}/simulate")
    
    # This endpoint now runs in the background and returns 202
    assert response.status_code == 202
    assert response.json() == {"message": "Simulation started in the background. Check back later for results."}
