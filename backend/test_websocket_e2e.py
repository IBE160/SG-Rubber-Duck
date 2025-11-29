import asyncio
import httpx
import websockets
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import time
import subprocess
import sys
from pathlib import Path

# Add backend directory to sys.path
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# --- Configuration ---
TEST_DB_PATH = "./temp_test.db"
API_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"
UVICORN_PROCESS = None

def run_alembic_command(cmd, revision="head"):
    from alembic.config import Config
    from alembic import command
    alembic_cfg = Config(str(ROOT / "alembic.ini")) # Pass alembic.ini config file path
    alembic_cfg.set_main_option("script_location", str(ROOT / "migrations")) # Explicitly set script location
    alembic_cfg.set_main_option("sqlalchemy.url", f"sqlite:///{TEST_DB_PATH}") # Set DB URL
    if cmd == "upgrade":
        command.upgrade(alembic_cfg, revision)
    elif cmd == "downgrade":
        command.downgrade(alembic_cfg, revision)

async def setup_db():
    print("Setting up test database...")
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
    run_alembic_command("upgrade")
    print("Test database setup complete.")

async def teardown_db():
    print("Tearing down test database...")
    run_alembic_command("downgrade", revision="base")
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
    print("Test database teardown complete.")

async def start_server():
    global UVICORN_PROCESS
    print(f"Starting uvicorn server at {API_URL}...")
    # Use subprocess.Popen to run uvicorn as a separate process
    # This assumes 'uvicorn' is available in the environment
    # or you can specify the full path: sys.executable -m uvicorn ...
    UVICORN_PROCESS = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=str(ROOT / "backend"), # Run uvicorn from the backend directory
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for the server to start (you might need a more robust check)
    time.sleep(2) # Give uvicorn some time to start up
    print("Uvicorn server started (hopefully).")

async def stop_server():
    global UVICORN_PROCESS
    if UVICORN_PROCESS:
        print("Stopping uvicorn server...")
        UVICORN_PROCESS.terminate()
        UVICORN_PROCESS.wait(timeout=5)
        if UVICORN_PROCESS.poll() is None:
            UVICORN_PROCESS.kill()
        print("Uvicorn server stopped.")

async def run_e2e_test():
    await setup_db()
    await start_server()

    try:
        print("Running E2E simulation test...")
        async with httpx.AsyncClient() as http_client:
            # 1. Create a project
            project_data = {"name": "E2E Sim Project", "description": "End-to-end simulation test project", "budget": 10000, "start_date": "2025-01-01", "end_date": "2025-12-31"}
            project_response = await http_client.post(f"{API_URL}/projects/", json=project_data)
            project_response.raise_for_status()
            project_id = project_response.json()["id"]
            print(f"Created Project with ID: {project_id}")

            # 2. Create tasks
            task1_data = {"text": "E2E Task 1", "duration": 5, "cost": 1000, "dependencies": [], "start_date": "2025-01-01"}
            task2_data = {"text": "E2E Task 2", "duration": 3, "cost": 500, "dependencies": [1], "start_date": "2025-01-06"}
            task_response1 = await http_client.post(f"{API_URL}/projects/{project_id}/tasks/", json=task1_data)
            task_response1.raise_for_status()
            task_id1 = task_response1.json()["id"]
            print(f"Created Task 1 with ID: {task_id1}")

            task_response2 = await http_client.post(f"{API_URL}/projects/{project_id}/tasks/", json=task2_data)
            task_response2.raise_for_status()
            task_id2 = task_response2.json()["id"]
            print(f"Created Task 2 with ID: {task_id2}")


            # 3. Create a risk
            risk_data = {"description": "E2E Risk 1", "probability": 0.5, "impact": "High", "duration_impact": 2, "cost_impact": 100, "affected_task_ids": [task_id1]}
            risk_response = await http_client.post(f"{API_URL}/projects/{project_id}/risks/", json=risk_data)
            risk_response.raise_for_status()
            print(f"Created Risk for Task {task_id1}")

            # 4. Connect to WebSocket for simulation
            async with websockets.connect(f"{WS_URL}/projects/{project_id}/simulate") as websocket:
                print("WebSocket connected. Sending simulation config...")
                simulation_config = {"num_iterations": 5, "seed": 99}
                await websocket.send(json.dumps(simulation_config))

                received_messages = []
                while True:
                    message_str = await websocket.recv()
                    message = json.loads(message_str)
                    received_messages.append(message)
                    print(f"Received message: {message['type']}")

                    if message["type"] == "complete":
                        print("Simulation complete message received.")
                        break
                    elif message["type"] == "error":
                        print(f"Simulation error: {message['data']}")
                        raise Exception(f"Simulation error: {message['data']}")
                    elif message["type"] == "progress":
                        # Send 'continue' to keep the simulation going (as expected by main.py)
                        await websocket.send("continue")

            # 5. Assert final results
            final_message = received_messages[-1]
            assert final_message["type"] == "complete"
            assert "min_duration" in final_message["data"]
            assert "avg_duration" in final_message["data"]
            assert "min_cost" in final_message["data"]
            assert "avg_cost" in final_message["data"]
            assert final_message["data"]["avg_duration"] > 0
            print("E2E simulation test PASSED!")

    except Exception as e:
        print(f"E2E simulation test FAILED: {e}")
        # Print server logs if available
        if UVICORN_PROCESS:
            stdout, stderr = UVICORN_PROCESS.communicate()
            print("\n--- Server Stdout ---")
            print(stdout.decode())
            print("\n--- Server Stderr ---")
            print(stderr.decode())
        sys.exit(1)
    finally:
        await stop_server()
        await teardown_db()

if __name__ == "__main__":
    asyncio.run(run_e2e_test())