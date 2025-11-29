import pytest
import asyncio
import httpx
import websockets
import json
from sqlalchemy.orm import Session
from backend import crud, schemas

# All fixtures ('live_server', 'db_session') are now provided by conftest.py

@pytest.mark.skip(reason="E2E test requires live server setup")
@pytest.mark.anyio
async def test_full_simulation_workflow(live_server: str, db_session: Session):
    """
    Tests the full end-to-end workflow against a live server:
    1. Create Project & Tasks directly in the DB.
    2. Create a Simulation Run directly in the DB.
    3. Connect a real async WebSocket client.
    4. Start the simulation via an API call to the live server.
    5. Receive and verify live events from the WebSocket.
    """
    # 1. Setup: Create data directly in the database
    project = crud.create_project(db_session, schemas.ProjectCreate(name="E2E Live Test", start_date="2025-01-01", end_date="2025-12-31"))
    task1 = crud.create_task(db_session, schemas.TaskCreate(text="Task 1", duration=2, dependencies=[], start_date="2025-01-01"), project.id)
    task2 = crud.create_task(db_session, schemas.TaskCreate(text="Task 2", duration=3, dependencies=[task1.id], start_date="2025-01-03"), project.id)
    sim_run = crud.create_simulation_run(db_session, project.id, schemas.SimulationRunCreate(seed=123))
    db_session.commit()
    
    project_id = project.id
    simulation_run_id = sim_run.id
    
    received_events = []
    ws_url = live_server.replace("http", "ws") + f"/ws/simulations/{simulation_run_id}/events"

    try:
        async with websockets.connect(ws_url) as websocket:
            # First event should be the connection confirmation
            connected_event = json.loads(await websocket.recv())
            assert connected_event['event_type'] == 'connected'
            received_events.append(connected_event)

            # 4. Start the simulation via an API call
            async with httpx.AsyncClient() as client:
                start_response = await client.post(f"{live_server}/projects/{project_id}/simulate/?simulation_run_id={simulation_run_id}")
                assert start_response.status_code == 202

            # 5. Receive events until completion
            while True:
                message = await asyncio.wait_for(websocket.recv(), timeout=10)
                data = json.loads(message)
                received_events.append(data)
                if data.get("event_type") == "simulation_completed":
                    break

    except Exception as e:
        pytest.fail(f"Test failed during WebSocket communication or simulation: {e}")

    # 6. Verify the received events
    event_types = [event['event_type'] for event in received_events]
    
    assert "connected" in event_types
    assert "simulation_started" in event_types
    assert "day_advanced" in event_types
    assert "task_started" in event_types
    assert "task_completed" in event_types
    assert "simulation_completed" in event_types
    
    task_1_completed = any(e.get('event_type') == 'task_completed' and e.get('task_id') == task1.id for e in received_events)
    task_2_completed = any(e.get('event_type') == 'task_completed' and e.get('task_id') == task2.id for e in received_events)
    assert task_1_completed
    assert task_2_completed
    
    final_event = received_events[-1]
    assert final_event["event_type"] == "simulation_completed"
    assert final_event["details"]["total_duration"] > 0
