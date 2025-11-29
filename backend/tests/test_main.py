import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app, get_db
from backend import models, crud, schemas
from backend.simulation_engine import SimulationEngine
from datetime import date

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

def test_project_patch_and_resources(client):
    # Create project
    project_response = client.post(
        "/projects/",
        json={"name": "Patch Me", "description": "A test project", "budget": 2000, "start_date": "2025-03-01", "end_date": "2025-04-01"},
    )
    project_id = project_response.json()["id"]

    # Patch budget/contingency/description
    patch_resp = client.patch(
        f"/projects/{project_id}",
        json={"budget": 3000, "contingency": 12.5, "description": "Updated desc"},
    )
    assert patch_resp.status_code == 200
    patched = patch_resp.json()
    assert patched["budget"] == 3000
    assert patched["contingency"] == 12.5
    assert patched["description"] == "Updated desc"

    # Create resources
    res_create = client.post(
        f"/projects/{project_id}/resources/",
        json={"name": "Crew A", "cost_per_day": 1000, "project_id": project_id},
    )
    assert res_create.status_code == 200
    res_id = res_create.json()["id"]

    # Update resource
    res_update = client.patch(
        f"/resources/{res_id}",
        json={"name": "Crew A+", "cost_per_day": 1200},
    )
    assert res_update.status_code == 200
    assert res_update.json()["name"] == "Crew A+"
    assert res_update.json()["cost_per_day"] == 1200

    # Read resources list
    res_list = client.get(f"/projects/{project_id}/resources/")
    assert res_list.status_code == 200
    resources = res_list.json()
    assert len(resources) == 1
    assert resources[0]["name"] == "Crew A+"

    # Delete resource
    res_delete = client.delete(f"/resources/{res_id}")
    assert res_delete.status_code == 200
    res_list_after = client.get(f"/projects/{project_id}/resources/")
    assert res_list_after.status_code == 200
    assert res_list_after.json() == []

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
    body = response.json()
    assert body["message"] == "Simulation started in the background. Check back later for results."
    assert "simulation_run_id" in body

def test_simulation_engine_smoke(client):
    db = TestingSessionLocal()
    try:
        proj = crud.create_project(db, schemas.ProjectCreate(name="Sim Smoke", description="Smoke", budget=5000, start_date="2025-01-01", end_date="2025-02-01"))
        t1 = crud.create_task(db, schemas.TaskCreate(text="Task A", start_date="2025-01-01", duration=2, cost=100, predecessors=[]), proj.id)
        crud.create_task(db, schemas.TaskCreate(text="Task B", start_date="2025-01-03", duration=3, cost=200, predecessors=[t1.id]), proj.id)
        crud.create_risk(db, schemas.RiskCreate(description="Rain delay", probability=0.2, impact="Medium", duration_impact=1, cost_impact=50, affected_task_ids=[t1.id]), proj.id)

        sim = crud.create_simulation_run(db, proj.id, schemas.SimulationRunCreate(seed=42))
        engine = SimulationEngine(db, sim.id)
        engine.run()
        db.refresh(sim)
        events = crud.get_event_logs(db, sim.id, 0, 200)
    finally:
        db.close()

    assert sim.status in ("completed", "failed")
    assert len(events) > 0
    event_types = [ev.event_type for ev in events]
    assert "simulation_started" in event_types
    if sim.status == "completed":
        assert sim.total_duration and sim.total_duration > 0
        assert "simulation_completed" in event_types
    else:
        assert "simulation_failed" in event_types
