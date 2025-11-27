from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
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


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    start_date = Column(Date)
    duration = Column(Integer)
    progress = Column(Float, default=0.0)
    cost = Column(Float, default=0.0)
    dependencies = Column(JSON, default=[])
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
    affected_task_ids = Column(JSON, default=[])
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="risks")
