from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    budget = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("Risk", back_populates="project", cascade="all, delete-orphan")
    simulation_runs = relationship("SimulationRun", back_populates="project", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    start_date = Column(Date)
    duration = Column(Integer)
    progress = Column(Float, default=0.0)
    cost = Column(Float, default=0.0)
    dependencies = Column(JSON, default=list)
    parent = Column(Integer)  # For sub-tasks, as seen in Gantt data
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="tasks")


class Risk(Base):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    probability = Column(Float)  # e.g., 0.1 for 10%
    impact = Column(String)  # e.g., "High", "Medium", "Low"
    duration_impact = Column(Integer, default=0)
    cost_impact = Column(Float, default=0.0)
    affected_task_ids = Column(JSON, default=list)
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="risks")


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    status = Column(String, default="pending")  # pending, running, completed, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Simulation parameters and results
    seed = Column(Integer, nullable=True)  # For reproducible simulations
    total_duration = Column(Integer, nullable=True)  # Final project duration
    total_cost = Column(Float, nullable=True)  # Final project cost
    critical_path = Column(JSON, default=[])  # Task IDs in critical path
    results = Column(JSON, default=dict)  # Aggregated simulation results

    project = relationship("Project", back_populates="simulation_runs")
    events = relationship("EventLog", back_populates="simulation_run", cascade="all, delete-orphan")


class EventLog(Base):
    __tablename__ = "event_logs"

    id = Column(Integer, primary_key=True, index=True)
    simulation_run_id = Column(Integer, ForeignKey("simulation_runs.id"))
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    event_type = Column(String, index=True)  # e.g., "task_started", "task_completed", "risk_triggered"
    task_id = Column(Integer, nullable=True)
    risk_id = Column(Integer, nullable=True)
    details = Column(JSON, default=dict)  # Additional event-specific data

    simulation_run = relationship("SimulationRun", back_populates="events")
