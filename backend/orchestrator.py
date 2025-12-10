import asyncio
import random
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set

from sqlalchemy.orm import Session

from . import crud, models, schemas
from .logic import calculate_cpm, CPMTask
from .connection_manager import manager as ws_manager


def utcnow_iso() -> str:
    """Return a timezone-aware ISO timestamp."""
    return datetime.now(timezone.utc).isoformat()


@dataclass
class TaskState:
    id: int
    name: str
    base_duration: int
    remaining: int
    base_cost: float
    dependencies: List[int] = field(default_factory=list)
    start_day: Optional[int] = None
    risk_cost: float = 0.0
    completed: bool = False

    @property
    def total_cost(self) -> float:
        return (self.base_cost or 0.0) + (self.risk_cost or 0.0)


class SimulationEngine:
    """
    Asynchronous, testable simulation runner.
    - Runs tasks in topological order with parallel execution of ready tasks.
    - Applies risks stochastically per-day for affected tasks.
    - Broadcasts a stable WebSocket contract: simulation_started, day_advanced,
      task_started, risk_triggered, task_completed, simulation_completed.
    """

    def __init__(self, db: Session, simulation_run_id: int):
        self.db = db
        self.simulation_run_id = simulation_run_id
        self.random = random.Random()
        self.event_count = 0
        self.risk_events = 0
        self.timeline: List[Dict] = []

    async def _log_and_broadcast(self, event_type: str, task_id: Optional[int] = None, risk_id: Optional[int] = None, details: Optional[dict] = None):
        details = details or {}
        event = schemas.EventLogCreate(
            event_type=event_type,
            task_id=task_id,
            risk_id=risk_id,
            details=details,
        )
        db_event = crud.create_event_log(self.db, event, self.simulation_run_id)
        payload = {
            "event_type": event_type,
            "timestamp": db_event.timestamp.replace(tzinfo=timezone.utc).isoformat() if db_event.timestamp.tzinfo is None else db_event.timestamp.isoformat(),
            "task_id": task_id,
            "risk_id": risk_id,
            "details": details,
        }
        await ws_manager.broadcast(self.simulation_run_id, payload)
        self.event_count += 1

    def _prepare_state(self, sim) -> Dict[int, TaskState]:
        tasks = crud.get_tasks(self.db, project_id=sim.project_id, skip=0, limit=1000)
        if not tasks:
            raise ValueError("Project has no tasks to simulate.")

        state: Dict[int, TaskState] = {}
        for t in tasks:
            duration = max(1, t.duration or 0)  # avoid zero-duration stalls
            state[t.id] = TaskState(
                id=t.id,
                name=t.text,
                base_duration=duration,
                remaining=duration,
                base_cost=t.cost or 0.0,
                dependencies=t.dependencies or [],
            )
        return state

    def _build_graph(self, state: Dict[int, TaskState]) -> Dict[str, Dict[int, Set[int]]]:
        indeg: Dict[int, int] = {tid: 0 for tid in state}
        dependents: Dict[int, Set[int]] = {tid: set() for tid in state}
        for t in state.values():
            for dep in t.dependencies:
                if dep in state:
                    indeg[t.id] += 1
                    dependents[dep].add(t.id)
        return {"indeg": indeg, "dependents": dependents}

    def _trigger_risks(self, risks: List[models.Risk], task: TaskState):
        for risk in risks:
            if risk.affected_task_ids and task.id not in risk.affected_task_ids:
                continue
            if self.random.random() < (risk.probability or 0):
                task.remaining += max(0, risk.duration_impact or 0)
                task.risk_cost += max(0.0, risk.cost_impact or 0.0)
                self.risk_events += 1
                asyncio.create_task(self._log_and_broadcast(
                    "risk_triggered",
                    task_id=task.id,
                    risk_id=risk.id,
                    details={
                        "description": risk.description,
                        "probability": risk.probability,
                        "duration_impact": risk.duration_impact,
                        "cost_impact": risk.cost_impact,
                    },
                ))

    async def run(self):
        sim = crud.get_simulation_run(self.db, simulation_run_id=self.simulation_run_id)
        if sim is None:
            return

        if sim.seed is not None:
            self.random.seed(sim.seed)

        try:
            state = self._prepare_state(sim)
        except ValueError:
            sim.status = "failed"
            self.db.commit()
            return

        graph = self._build_graph(state)
        indeg, dependents = graph["indeg"], graph["dependents"]

        cpm_input = [CPMTask(id=t.id, duration=t.base_duration, cost=t.base_cost, dependencies=t.dependencies) for t in state.values()]
        try:
            cpm_result = calculate_cpm(cpm_input)
            base_duration = cpm_result["project_duration"]
            critical_path = cpm_result["critical_path"]
        except Exception:
            base_duration = sum(t.base_duration for t in state.values())
            critical_path = []

        risks = crud.get_risks(self.db, project_id=sim.project_id, skip=0, limit=1000)

        sim.status = "running"
        sim.started_at = datetime.now(timezone.utc)
        sim.critical_path = critical_path
        self.db.commit()

        await self._log_and_broadcast(
            "simulation_started",
            details={
                "project_id": sim.project_id,
                "simulation_run_id": sim.id,
                "tasks": len(state),
                "risks": len(risks),
                "base_duration": base_duration,
                "critical_path": critical_path,
            },
        )

        ready = [tid for tid, deg in indeg.items() if deg == 0]
        active: Set[int] = set()
        completed = 0
        day = 0
        total_cost = 0.0
        safety_limit = sum(t.base_duration for t in state.values()) + len(state) * 10

        async def start_task(tid: int, current_day: int):
            task = state[tid]
            if task.start_day is None:
                task.start_day = current_day
                await self._log_and_broadcast(
                    "task_started",
                    task_id=tid,
                    details={"task_name": task.name, "remaining": task.remaining},
                )
            active.add(tid)

        while completed < len(state) and safety_limit > 0:
            for tid in list(ready):
                await start_task(tid, day)
            ready.clear()

            if not active:
                sim.status = "failed"
                sim.completed_at = datetime.now(timezone.utc)
                self.db.commit()
                await self._log_and_broadcast(
                    "simulation_failed",
                    details={"reason": "No active tasks and graph not complete (possible cycle)."},
                )
                return

            day += 1
            await self._log_and_broadcast(
                "day_advanced",
                details={"day": day, "active_tasks": list(active), "completed": completed, "pending": len(state) - completed},
            )

            for tid in list(active):
                task = state[tid]
                self._trigger_risks(risks, task)

                if task.remaining > 0:
                    task.remaining -= 1

                if task.remaining <= 0:
                    active.remove(tid)
                    task.completed = True
                    completed += 1
                    total_cost += task.total_cost
                    task_duration = (day - (task.start_day or 0))
                    await self._log_and_broadcast(
                        "task_completed",
                        task_id=tid,
                        details={
                            "duration": task_duration,
                            "cost": task.total_cost,
                            "risk_cost": task.risk_cost,
                            "base_cost": task.base_cost,
                        },
                    )
                    for dep in dependents.get(tid, []):
                        indeg[dep] -= 1
                        if indeg[dep] == 0:
                            ready.append(dep)

            self.timeline.append({"day": day, "active": len(active), "completed": completed})
            safety_limit -= 1
            await asyncio.sleep(0.1)  # Yield control to the event loop

        if completed < len(state):
            sim.status = "failed"
            sim.completed_at = datetime.now(timezone.utc)
            self.db.commit()
            await self._log_and_broadcast(
                "simulation_failed",
                details={"reason": "Safety limit reached before completion."},
            )
            return

        sim.status = "completed"
        sim.total_duration = day
        sim.total_cost = total_cost
        sim.completed_at = datetime.now(timezone.utc)
        sim.results = {
            "total_duration": day,
            "total_cost": total_cost,
            "tasks_completed": completed,
            "risk_events": self.risk_events,
            "event_count": self.event_count,
            "base_duration": base_duration,
            "critical_path": critical_path,
            "timeline": self.timeline,
        }
        self.db.commit()

        await self._log_and_broadcast(
            "simulation_completed",
            details={
                "total_duration": day,
                "total_cost": total_cost,
                "tasks_completed": completed,
                "risk_events": self.risk_events,
            },
        )

from .database import SessionLocal # Import SessionLocal

# ... (rest of imports)

# ... (TaskState and SimulationEngine classes remain unchanged)

async def run_simulation(simulation_run_id: int): # Removed db argument
    """Orchestrates a single simulation run asynchronously."""
    db = SessionLocal() # Create new session
    try:
        engine = SimulationEngine(db, simulation_run_id)
        await engine.run()
    finally:
        db.close() # Ensure session is closed
