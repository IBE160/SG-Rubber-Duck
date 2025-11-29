import json
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend import models
from backend.database import Base, engine


def setup_db():
    Base.metadata.create_all(bind=engine)


@pytest.mark.anyio
async def test_websocket_broadcast_event():
    setup_db()
    client = TestClient(app)

    proj = client.post("/projects/", json={
        "name": "WS Test",
        "description": "ws",
        "budget": 1000,
        "start_date": "2025-01-01",
        "end_date": "2025-01-10"
    }).json()
    project_id = proj["id"]

    sim = client.post(f"/projects/{project_id}/simulations/", json={"seed": 1}).json()
    simulation_id = sim["id"]

    with client.websocket_connect(f"/ws/simulations/{simulation_id}/events") as ws:
        first = ws.receive_json()
        assert first["event_type"] == "connected"

        payload = {"event_type": "task_started", "task_id": 1, "details": {"hello": "world"}, "risk_id": None}
        res = client.post(f"/simulations/{simulation_id}/broadcast-event/", json=payload)
        assert res.status_code == 200

        msg = ws.receive_json()
        assert msg["event_type"] == "task_started"
        assert msg["task_id"] == 1
        assert msg["details"]["hello"] == "world"
