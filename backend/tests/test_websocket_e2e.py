import pytest
import httpx
import websockets
import json
from sqlalchemy.orm import Session
from backend import crud, schemas

@pytest.mark.anyio
async def test_websocket_broadcast_event(live_server: str, db_session: Session):
    project = crud.create_project(db_session, schemas.ProjectCreate(name="WS Test", description="ws", budget=1000, start_date="2025-01-01", end_date="2025-01-10"))
    db_session.commit()
    
    simulation_run = crud.create_simulation_run(db_session, project.id, schemas.SimulationRunCreate(seed=1))
    db_session.commit()

    ws_url = live_server.replace("http", "ws") + f"/ws/simulations/{simulation_run.id}/events"
    
    async with websockets.connect(ws_url) as websocket:
        # 1. Test connection
        connected_event = json.loads(await websocket.recv())
        assert connected_event['event_type'] == 'connected'

        # 2. Broadcast an event via HTTP endpoint
        event_payload = {
            "event_type": "test_event",
            "details": {"message": "Hello from test"},
            "task_id": None,
            "risk_id": None
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{live_server}/simulations/{simulation_run.id}/broadcast-event/",
                json=event_payload
            )
            assert response.status_code == 200
            assert response.json()["status"] == "event_broadcasted"

        # 3. Verify event is received via WebSocket
        received_message = json.loads(await websocket.recv())
        
        assert received_message["event_type"] == "test_event"
        assert received_message["details"]["message"] == "Hello from test"

