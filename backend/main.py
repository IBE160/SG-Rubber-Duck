# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .config import settings
from .database import SessionLocal, engine
from . import models, schemas, crud

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
