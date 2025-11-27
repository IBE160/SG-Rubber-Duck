import json
from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Any

from fastapi.middleware.cors import CORSMiddleware
from . import crud, models, schemas, logic, ai_insights
from .database import SessionLocal, engine


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/simulate/cpm", response_model=dict)
def simulate_cpm(tasks: List[logic.CPMTask]) -> Any:
    """
    Receives a list of tasks and calculates the Critical Path Method (CPM).
    """
    try:
        result = logic.calculate_cpm(tasks)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the SG-Rubber-Duck Project API"}

@app.post("/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.get("/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.post("/projects/{project_id}/tasks/", response_model=schemas.Task)
def create_task_for_project(
    project_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)
):
    return crud.create_task(db=db, task=task, project_id=project_id)

@app.get("/projects/{project_id}/tasks/", response_model=List[schemas.Task])
def read_tasks_for_project(
    project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    tasks = crud.get_tasks(db, project_id=project_id, skip=skip, limit=limit)
    return tasks

@app.patch("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id=task_id, task_in=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}", response_model=schemas.Task)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Risk Endpoints
@app.post("/projects/{project_id}/risks/", response_model=schemas.Risk)
def create_risk_for_project(
    project_id: int, risk: schemas.RiskCreate, db: Session = Depends(get_db)
):
    return crud.create_risk(db=db, risk=risk, project_id=project_id)

@app.get("/projects/{project_id}/risks/", response_model=List[schemas.Risk])
def read_risks_for_project(
    project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    risks = crud.get_risks(db, project_id=project_id, skip=skip, limit=limit)
    return risks

@app.patch("/risks/{risk_id}", response_model=schemas.Risk)
def update_risk(risk_id: int, risk: schemas.RiskCreate, db: Session = Depends(get_db)):
    db_risk = crud.update_risk(db, risk_id=risk_id, risk_in=risk)
    if db_risk is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    return db_risk

@app.delete("/risks/{risk_id}", response_model=schemas.Risk)
def delete_risk(risk_id: int, db: Session = Depends(get_db)):
    db_risk = crud.delete_risk(db, risk_id=risk_id)
    if db_risk is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    return db_risk

def run_simulation_and_save(project_id: int, iterations: int, db: Session):
    """
    The actual simulation logic that runs in the background.
    Saves results to a file.
    """
    db_tasks = crud.get_tasks(db, project_id=project_id, limit=1000)
    db_risks = crud.get_risks(db, project_id=project_id, limit=1000)

    if not db_tasks:
        # In a real app, you'd handle this error more gracefully,
        # e.g., by updating a status in the database.
        print(f"Project {project_id}: No tasks found, simulation aborted.")
        return

    cpm_tasks = [
        logic.CPMTask(
            id=task.id,
            duration=task.duration,
            cost=task.cost or 0,
            dependencies=task.dependencies or []
        ) for task in db_tasks
    ]
    
    monte_carlo_risks = [
        logic.MonteCarloRisk(
            id=risk.id,
            probability=risk.probability,
            duration_impact=risk.duration_impact,
            cost_impact=risk.cost_impact or 0,
            affected_task_ids=risk.affected_task_ids or []
        ) for risk in db_risks
    ]
    
    try:
        simulation_result = logic.run_monte_carlo_simulation(cpm_tasks, monte_carlo_risks, iterations)
        insights = ai_insights.get_insights_from_simulation(simulation_result)
        final_result = {**simulation_result, **insights}
        
        # Save result to a file
        with open(f"{project_id}_simulation_result.json", "w") as f:
            json.dump(final_result, f, indent=4)
        print(f"Project {project_id}: Simulation finished and results saved.")

    except Exception as e:
        print(f"Project {project_id}: Simulation failed with error: {e}")


@app.post("/projects/{project_id}/simulate", status_code=202)
def run_project_simulation_background(
    project_id: int, 
    background_tasks: BackgroundTasks,
    iterations: int = 1000, 
    db: Session = Depends(get_db)
):
    """
    Starts a Monte Carlo simulation in the background.
    """
    background_tasks.add_task(run_simulation_and_save, project_id, iterations, db)
    return {"message": "Simulation started in the background. Check back later for results."}


@app.get("/projects/{project_id}/simulation_result", response_model=dict)
def get_simulation_result(project_id: int):
    """
    Retrieves the results of the latest simulation for a project.
    """
    try:
        with open(f"{project_id}_simulation_result.json", "r") as f:
            result = json.load(f)
        return result
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Simulation result not found. Please run a simulation first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while reading results: {str(e)}")
