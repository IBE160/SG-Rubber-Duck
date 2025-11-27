from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Optional

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

class Task(TaskBase):
    id: int
    project_id: int

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

    model_config = ConfigDict(from_attributes=True)
