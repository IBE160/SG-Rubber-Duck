import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.main import app, get_db
from backend.database import SessionLocal, engine, Base
from backend.models import Project, Task, Risk, SimulationRun
from backend import crud
import json

# Setup the test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_e2e_simulation_workflow(db_session: Session):
    # 1. Create a project
    project_response = client.post("/projects/", json={"name": "E2E Test Project", "description": "A project for E2E testing", "start_date": "2025-01-01", "end_date": "2025-12-31"})
    assert project_response.status_code == 200
    project_id = project_response.json()["id"]

    # 2. Create tasks
    task1_response = client.post(f"/projects/{project_id}/tasks/", json={"text": "Task 1", "duration": 10, "cost": 1000, "start_date": "2025-01-01", "predecessors": []})
    assert task1_response.status_code == 200
    task1_id = task1_response.json()["id"]

    task2_response = client.post(f"/projects/{project_id}/tasks/", json={"text": "Task 2", "duration": 5, "cost": 500, "start_date": "2025-01-11", "predecessors": [task1_id]})
    assert task2_response.status_code == 200

    # 3. Start a simulation
    simulation_response = client.post(f"/projects/{project_id}/simulate?run_in_background=false")
    assert simulation_response.status_code == 200
    simulation_id = simulation_response.json()["simulation_run_id"]

    # 4. Verify simulation events in the database
    events = crud.get_event_logs(db_session, simulation_id)
    assert len(events) > 0
    event_types = [event.event_type for event in events]
    assert "simulation_started" in event_types
    assert "task_started" in event_types
    assert "task_completed" in event_types
    assert "simulation_completed" in event_types

    # 5. Verify simulation status
    status_response = client.get(f"/simulations/{simulation_id}/status")
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "completed"
