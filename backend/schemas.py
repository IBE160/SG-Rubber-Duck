from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import List, Optional, Dict, Any

# Risk Schemas
class RiskBase(BaseModel):
    description: str
    probability: float
    impact: str
    duration_impact: int = 0
    cost_impact: float = 0.0
    affected_task_ids: List[int] = []

class RiskCreate(RiskBase):
    pass

class Risk(RiskBase):
    id: int
    project_id: int

    model_config = ConfigDict(from_attributes=True)

# Task Schemas
class TaskBase(BaseModel):
    text: str
    start_date: date
    duration: int
    progress: float = 0.0
    parent: Optional[int] = None
    cost: float = 0.0
    dependencies: List[int] = []

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    text: Optional[str] = None
    start_date: Optional[date] = None
    duration: Optional[int] = None
    progress: Optional[float] = None
    parent: Optional[int] = None
    cost: Optional[float] = None
    dependencies: Optional[List[int]] = None

class Task(TaskBase):
    id: int
    project_id: int

    model_config = ConfigDict(from_attributes=True)

# EventLog Schemas
class EventLogBase(BaseModel):
    event_type: str
    task_id: Optional[int] = None
    risk_id: Optional[int] = None
    details: Dict[str, Any] = {}

class EventLogCreate(EventLogBase):
    pass

class EventLog(EventLogBase):
    id: int
    simulation_run_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

# SimulationRun Schemas
class SimulationRunBase(BaseModel):
    status: str = "pending"
    seed: Optional[int] = None
    total_duration: Optional[int] = None
    total_cost: Optional[float] = None
    critical_path: List[int] = []
    results: Dict[str, Any] = {}

class SimulationRunCreate(BaseModel):
    seed: Optional[int] = None

class SimulationRunUpdate(BaseModel):
    status: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_duration: Optional[int] = None
    total_cost: Optional[float] = None
    critical_path: Optional[List[int]] = None
    results: Optional[Dict[str, Any]] = None

class SimulationRun(SimulationRunBase):
    id: int
    project_id: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    events: List[EventLog] = []

    model_config = ConfigDict(from_attributes=True)

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    budget: Optional[float] = None
    start_date: date
    end_date: date

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    tasks: List[Task] = []
    risks: List[Risk] = []
    simulation_runs: List[SimulationRun] = []

    model_config = ConfigDict(from_attributes=True)
