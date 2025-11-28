# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import asyncio
import json

from .config import settings
from .database import SessionLocal, engine
from . import models, schemas, crud
from .cpm import calculate_cpm

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_description,
    debug=settings.debug_mode,
)


# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", tags=["Health"])
async def root():
    return {"message": "FastAPI is running!"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": settings.app_version}


# Project endpoints
@app.post("/projects/", response_model=schemas.Project, tags=["Projects"])
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)


@app.get("/projects/", response_model=List[schemas.Project], tags=["Projects"])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_projects(db, skip=skip, limit=limit)


@app.get("/projects/{project_id}", response_model=schemas.Project, tags=["Projects"])
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.patch("/projects/{project_id}", response_model=schemas.Project, tags=["Projects"])
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    for var, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, var, value)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@app.delete("/projects/{project_id}", tags=["Projects"])
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}


# Task endpoints
@app.post("/projects/{project_id}/tasks/", response_model=schemas.Task, tags=["Tasks"])
def create_task_for_project(
    project_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)
):
    # Ensure project exists
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_task(db=db, task=task, project_id=project_id)


@app.get("/projects/{project_id}/tasks/", response_model=List[schemas.Task], tags=["Tasks"])
def read_tasks_for_project(
    project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_tasks(db, project_id=project_id, skip=skip, limit=limit)


@app.get("/tasks/{task_id}", response_model=schemas.Task, tags=["Tasks"])
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@app.patch("/tasks/{task_id}", response_model=schemas.Task, tags=["Tasks"])
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    for var, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, var, value)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@app.delete("/tasks/{task_id}", response_model=schemas.Task, tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# Risk endpoints
@app.post("/projects/{project_id}/risks/", response_model=schemas.Risk, tags=["Risks"])
def create_risk_for_project(
    project_id: int, risk: schemas.RiskCreate, db: Session = Depends(get_db)
):
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_risk(db=db, risk=risk, project_id=project_id)


@app.get("/projects/{project_id}/risks/", response_model=List[schemas.Risk], tags=["Risks"])
def read_risks_for_project(
    project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_risks(db, project_id=project_id, skip=skip, limit=limit)


@app.patch("/risks/{risk_id}", response_model=schemas.Risk, tags=["Risks"])
def update_risk(risk_id: int, risk: schemas.RiskCreate, db: Session = Depends(get_db)):
    db_risk = crud.update_risk(db, risk_id=risk_id, risk_in=risk)
    if db_risk is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    return db_risk


@app.delete("/risks/{risk_id}", response_model=schemas.Risk, tags=["Risks"])
def delete_risk(risk_id: int, db: Session = Depends(get_db)):
    db_risk = crud.delete_risk(db, risk_id=risk_id)
    if db_risk is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    return db_risk


# SimulationRun endpoints
@app.post("/projects/{project_id}/simulations/", response_model=schemas.SimulationRun, tags=["Simulations"])
def create_simulation_run(
    project_id: int, simulation_run: schemas.SimulationRunCreate, db: Session = Depends(get_db)
):
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_simulation_run(db=db, project_id=project_id, simulation_run=simulation_run)


@app.get("/projects/{project_id}/simulations/", response_model=List[schemas.SimulationRun], tags=["Simulations"])
def read_simulation_runs_for_project(
    project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    if crud.get_project(db, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_simulation_runs(db, project_id=project_id, skip=skip, limit=limit)


@app.get("/simulations/{simulation_run_id}", response_model=schemas.SimulationRun, tags=["Simulations"])
def read_simulation_run(simulation_run_id: int, db: Session = Depends(get_db)):
    simulation_run = crud.get_simulation_run(db, simulation_run_id=simulation_run_id)
    if simulation_run is None:
        raise HTTPException(status_code=404, detail="Simulation run not found")
    return simulation_run


@app.patch("/simulations/{simulation_run_id}", response_model=schemas.SimulationRun, tags=["Simulations"])
def update_simulation_run(
    simulation_run_id: int, simulation_run: schemas.SimulationRunUpdate, db: Session = Depends(get_db)
):
    db_simulation_run = crud.update_simulation_run(db, simulation_run_id=simulation_run_id, simulation_run_in=simulation_run)
    if db_simulation_run is None:
        raise HTTPException(status_code=404, detail="Simulation run not found")
    return db_simulation_run


@app.delete("/simulations/{simulation_run_id}", tags=["Simulations"])
def delete_simulation_run(simulation_run_id: int, db: Session = Depends(get_db)):
    db_simulation_run = crud.delete_simulation_run(db, simulation_run_id=simulation_run_id)
    if db_simulation_run is None:
        raise HTTPException(status_code=404, detail="Simulation run not found")
    return {"message": "Simulation run deleted successfully"}


# EventLog endpoints
@app.post("/simulations/{simulation_run_id}/events/", response_model=schemas.EventLog, tags=["Events"])
def create_event_log(
    simulation_run_id: int, event_log: schemas.EventLogCreate, db: Session = Depends(get_db)
):
    if crud.get_simulation_run(db, simulation_run_id) is None:
        raise HTTPException(status_code=404, detail="Simulation run not found")
    return crud.create_event_log(db=db, event_log=event_log, simulation_run_id=simulation_run_id)


@app.get("/simulations/{simulation_run_id}/events/", response_model=List[schemas.EventLog], tags=["Events"])
def read_event_logs_for_simulation(
    simulation_run_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    if crud.get_simulation_run(db, simulation_run_id) is None:
        raise HTTPException(status_code=404, detail="Simulation run not found")
    return crud.get_event_logs(db, simulation_run_id=simulation_run_id, skip=skip, limit=limit)


@app.delete("/events/{event_log_id}", tags=["Events"])
def delete_event_log(event_log_id: int, db: Session = Depends(get_db)):
    db_event_log = crud.delete_event_log(db, event_log_id=event_log_id)
    if db_event_log is None:
        raise HTTPException(status_code=404, detail="Event log not found")
    return {"message": "Event log deleted successfully"}


# CPM Calculation endpoints
@app.post("/projects/{project_id}/calculate-cpm/", tags=["Simulation"])
def calculate_project_cpm(project_id: int, db: Session = Depends(get_db)):
    """
    Calculate the Critical Path Method for a project.
    Returns critical path, project duration, and task schedules.
    """
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get all tasks for the project
    tasks = crud.get_tasks(db, project_id=project_id, skip=0, limit=1000)
    
    if not tasks:
        raise HTTPException(status_code=400, detail="Project has no tasks")
    
    # Prepare task data for CPM
    task_data = [
        {
            "id": task.id,
            "duration": task.duration,
            "dependencies": task.dependencies or []
        }
        for task in tasks
    ]
    
    try:
        result = calculate_cpm(task_data, project.start_date)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CPM calculation error: {str(e)}")


# WebSocket endpoints for simulation event streaming
class ConnectionManager:
    """Manages WebSocket connections for active simulations"""
    
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, simulation_id: int):
        """Register a new WebSocket connection for a simulation"""
        await websocket.accept()
        if simulation_id not in self.active_connections:
            self.active_connections[simulation_id] = []
        self.active_connections[simulation_id].append(websocket)
    
    def disconnect(self, simulation_id: int, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if simulation_id in self.active_connections:
            self.active_connections[simulation_id].remove(websocket)
            if not self.active_connections[simulation_id]:
                del self.active_connections[simulation_id]
    
    async def broadcast(self, simulation_id: int, message: dict):
        """Send a message to all connections for a simulation"""
        if simulation_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[simulation_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)
            
            for connection in disconnected:
                self.disconnect(simulation_id, connection)


manager = ConnectionManager()


@app.websocket("/ws/simulations/{simulation_id}/events")
async def websocket_simulation_events(websocket: WebSocket, simulation_id: int, db: Session = Depends(get_db)):
    """
    WebSocket endpoint for receiving simulation events in real-time.
    
    Clients connect with: ws://localhost:8001/ws/simulations/{simulation_id}/events
    
    Server sends events like:
    {
        "event_type": "task_started",
        "timestamp": "2025-11-28T17:00:00",
        "task_id": 1,
        "details": {}
    }
    
    Clients can send:
    {
        "action": "ping"
    }
    """
    # Verify simulation exists
    simulation = crud.get_simulation_run(db, simulation_id)
    if simulation is None:
        await websocket.close(code=404)
        return
    
    await manager.connect(websocket, simulation_id)
    
    # Send connection confirmation
    await websocket.send_json({
        "event_type": "connected",
        "message": f"Connected to simulation {simulation_id}",
        "timestamp": get_timestamp()
    })
    
    try:
        while True:
            # Receive message from client (for keep-alive or commands)
            data = await websocket.receive_json()
            
            if data.get("action") == "ping":
                # Respond to ping
                await websocket.send_json({
                    "event_type": "pong",
                    "timestamp": get_timestamp()
                })
            elif data.get("action") == "subscribe_updates":
                # Send last event log entries as initial data
                events = crud.get_event_logs(db, simulation_id, skip=0, limit=50)
                for event in events:
                    await websocket.send_json({
                        "event_type": event.event_type,
                        "timestamp": event.timestamp.isoformat(),
                        "task_id": event.task_id,
                        "risk_id": event.risk_id,
                        "details": event.details or {}
                    })
    
    except WebSocketDisconnect:
        manager.disconnect(simulation_id, websocket)
    except Exception as e:
        manager.disconnect(simulation_id, websocket)
        print(f"WebSocket error: {e}")


def get_timestamp():
    """Get current timestamp in ISO format"""
    from datetime import datetime
    return datetime.utcnow().isoformat()


@app.post("/simulations/{simulation_id}/broadcast-event/", tags=["Simulation"])
async def broadcast_event(
    simulation_id: int,
    event: schemas.EventLogCreate,
    db: Session = Depends(get_db)
):
    """
    Broadcast an event to all connected WebSocket clients for a simulation.
    This is used by the simulation engine to push events in real-time.
    """
    # Verify simulation exists
    simulation = crud.get_simulation_run(db, simulation_id)
    if simulation is None:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    # Save event to database
    db_event = crud.create_event_log(db, event, simulation_id)
    
    # Broadcast to connected clients
    await manager.broadcast(simulation_id, {
        "event_type": event.event_type,
        "timestamp": db_event.timestamp.isoformat(),
        "task_id": event.task_id,
        "risk_id": event.risk_id,
        "details": event.details or {}
    })
    
    return {"status": "event_broadcasted", "event_id": db_event.id}
