from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

# Project CRUD
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Task CRUD
def get_tasks(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Task).filter(models.Task.project_id == project_id).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate, project_id: int):
    payload = task.model_dump()
    deps = payload.pop("predecessors", payload.pop("dependencies", []))
    db_task = models.Task(**payload, dependencies=deps, project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_in):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        data = task_in.model_dump(exclude_unset=True)
        deps = data.pop("predecessors", data.pop("dependencies", None))
        for var, value in data.items():
            setattr(db_task, var, value)
        if deps is not None:
            db_task.dependencies = deps
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

# Risk CRUD
def get_risk(db: Session, risk_id: int):
    return db.query(models.Risk).filter(models.Risk.id == risk_id).first()

def get_risks(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Risk).filter(models.Risk.project_id == project_id).offset(skip).limit(limit).all()

def create_risk(db: Session, risk: schemas.RiskCreate, project_id: int):
    db_risk = models.Risk(**risk.model_dump(), project_id=project_id)
    db.add(db_risk)
    db.commit()
    db.refresh(db_risk)
    return db_risk

def update_risk(db: Session, risk_id: int, risk_in: schemas.RiskCreate):
    db_risk = db.query(models.Risk).filter(models.Risk.id == risk_id).first()
    if db_risk:
        for var, value in risk_in.dict(exclude_unset=True).items():
            setattr(db_risk, var, value)
        db.add(db_risk)
        db.commit()
        db.refresh(db_risk)
    return db_risk

def delete_risk(db: Session, risk_id: int):
    db_risk = db.query(models.Risk).filter(models.Risk.id == risk_id).first()
    if db_risk:
        db.delete(db_risk)
        db.commit()
    return db_risk

# Resource CRUD
def get_resources(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Resource)
        .filter(models.Resource.project_id == project_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_resource(db: Session, project_id: int, resource: schemas.ResourceCreate):
    db_resource = models.Resource(project_id=project_id, **resource.model_dump(exclude={"project_id"}))
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

def update_resource(db: Session, resource_id: int, resource_in: schemas.ResourceUpdate):
    db_res = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_res:
        for var, value in resource_in.model_dump(exclude_unset=True).items():
            setattr(db_res, var, value)
        db.add(db_res)
        db.commit()
        db.refresh(db_res)
    return db_res

def delete_resource(db: Session, resource_id: int):
    db_res = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_res:
        db.delete(db_res)
        db.commit()
    return db_res

# SimulationRun CRUD
def get_simulation_run(db: Session, simulation_run_id: int):
    return db.query(models.SimulationRun).filter(models.SimulationRun.id == simulation_run_id).first()

def get_simulation_runs(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.SimulationRun).filter(models.SimulationRun.project_id == project_id).offset(skip).limit(limit).all()

def create_simulation_run(db: Session, project_id: int, simulation_run: schemas.SimulationRunCreate):
    db_simulation_run = models.SimulationRun(project_id=project_id, **simulation_run.model_dump())
    db.add(db_simulation_run)
    db.commit()
    db.refresh(db_simulation_run)
    return db_simulation_run

def update_simulation_run(db: Session, simulation_run_id: int, simulation_run_in: schemas.SimulationRunUpdate):
    db_simulation_run = db.query(models.SimulationRun).filter(models.SimulationRun.id == simulation_run_id).first()
    if db_simulation_run:
        for var, value in simulation_run_in.model_dump(exclude_unset=True).items():
            setattr(db_simulation_run, var, value)
        db.add(db_simulation_run)
        db.commit()
        db.refresh(db_simulation_run)
    return db_simulation_run

def delete_simulation_run(db: Session, simulation_run_id: int):
    db_simulation_run = db.query(models.SimulationRun).filter(models.SimulationRun.id == simulation_run_id).first()
    if db_simulation_run:
        db.delete(db_simulation_run)
        db.commit()
    return db_simulation_run

# EventLog CRUD
def get_event_log(db: Session, event_log_id: int):
    return db.query(models.EventLog).filter(models.EventLog.id == event_log_id).first()

def get_event_logs(db: Session, simulation_run_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.EventLog).filter(models.EventLog.simulation_run_id == simulation_run_id).offset(skip).limit(limit).all()

def create_event_log(db: Session, event_log: schemas.EventLogCreate, simulation_run_id: int):
    db_event_log = models.EventLog(**event_log.model_dump(), simulation_run_id=simulation_run_id)
    db.add(db_event_log)
    db.commit()
    db.refresh(db_event_log)
    return db_event_log

def delete_event_log(db: Session, event_log_id: int):
    db_event_log = db.query(models.EventLog).filter(models.EventLog.id == event_log_id).first()
    if db_event_log:
        db.delete(db_event_log)
        db.commit()
    return db_event_log