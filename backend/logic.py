from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import date, timedelta
import random
import numpy as np
import copy

# Schema for tasks used in CPM calculation, extending the base schema implicitly
class CPMTask(BaseModel):
    id: int
    duration: int
    cost: float
    dependencies: List[int] = []

class MonteCarloRisk(BaseModel):
    id: int
    probability: float
    duration_impact: int
    cost_impact: float
    affected_task_ids: List[int]


def run_monte_carlo_simulation(tasks: List[CPMTask], risks: List[MonteCarloRisk], iterations: int = 1000) -> Dict[str, Any]:
    """
    Performs a Monte Carlo simulation on a project schedule and cost.
    """
    base_cpm_result = calculate_cpm(tasks)
    base_total_cost = sum(task.cost for task in tasks)
    
    simulation_durations = []
    simulation_costs = []

    for i in range(iterations):
        iter_tasks = [task.model_copy(deep=True) for task in tasks]
        iter_task_map = {task.id: task for task in iter_tasks}
        
        current_cost = base_total_cost

        # Apply risks
        for risk in risks:
            if random.random() < risk.probability:
                # Risk occurs, apply its impacts
                current_cost += risk.cost_impact
                for task_id in risk.affected_task_ids:
                    if task_id in iter_task_map:
                        iter_task_map[task_id].duration += risk.duration_impact

        # Run CPM on the modified tasks for this iteration
        try:
            cpm_result = calculate_cpm(iter_tasks)
            simulation_durations.append(cpm_result['project_duration'])
            simulation_costs.append(current_cost)
        except ValueError:
            continue
            
    # Analyze results
    if not simulation_durations:
        return {"error": "Could not complete any simulation runs."}
        
    return {
        "base_duration": base_cpm_result['project_duration'],
        "base_critical_path": base_cpm_result['critical_path'],
        "base_cpm_task_details": base_cpm_result['tasks'],
        "base_cost": base_total_cost,
        "iterations": len(simulation_durations),
        "mean_duration": np.mean(simulation_durations),
        "std_dev_duration": np.std(simulation_durations),
        "p50_duration": np.percentile(simulation_durations, 50),
        "p80_duration": np.percentile(simulation_durations, 80),
        "p90_duration": np.percentile(simulation_durations, 90),
        "duration_distribution": np.histogram(simulation_durations, bins='auto')[0].tolist(),
        "bin_edges_duration": np.histogram(simulation_durations, bins='auto')[1].tolist(),
        "mean_cost": np.mean(simulation_costs),
        "std_dev_cost": np.std(simulation_costs),
        "p50_cost": np.percentile(simulation_costs, 50),
        "p80_cost": np.percentile(simulation_costs, 80),
        "p90_cost": np.percentile(simulation_costs, 90),
        "cost_distribution": np.histogram(simulation_costs, bins='auto')[0].tolist(),
        "bin_edges_cost": np.histogram(simulation_costs, bins='auto')[1].tolist(),
    }


def calculate_cpm(tasks: List[CPMTask]) -> Dict[str, Any]:
    """
    Calculates the Critical Path Method (CPM) for a list of tasks.

    Args:
        tasks: A list of tasks, where each task has an id, duration, and dependencies.

    Returns:
        A dictionary containing the project duration, the critical path, and details for each task.
    """
    if not tasks:
        return {'project_duration': 0, 'critical_path': [], 'tasks': []}
        
    task_map = {task.id: task for task in tasks}
    
    # Initialize earliest and latest start/finish times
    es = {task.id: 0 for task in tasks}
    ef = {task.id: 0 for task in tasks}
    ls = {task.id: float('inf') for task in tasks}
    lf = {task.id: float('inf') for task in tasks}

    # Forward Pass: Calculate Earliest Start (ES) and Earliest Finish (EF)
    sorted_tasks = _topological_sort(tasks)
    
    for task_id in sorted_tasks:
        task = task_map[task_id]
        if not task.dependencies:
            es[task_id] = 0
        else:
            predecessor_efs = [ef.get(dep_id, 0) for dep_id in task.dependencies]
            es[task_id] = max(predecessor_efs)
        
        # Assuming duration is in days. Day 1 is the start. 
        ef[task_id] = es[task_id] + task.duration

    project_duration = max(ef.values()) if ef else 0

    # Backward Pass: Calculate Latest Start (LS) and Latest Finish (LF)
    for task_id in reversed(sorted_tasks):
        task = task_map[task_id]
        if not _get_successors(task.id, tasks):
            lf[task_id] = project_duration
        else:
            successors = _get_successors(task.id, tasks)
            lf[task_id] = min(ls.get(succ.id, project_duration) for succ in successors)
        
        ls[task_id] = lf[task_id] - task.duration

    # Calculate Slack and Critical Path
    slack = {task_id: ls[task_id] - es[task_id] for task_id in sorted_tasks}
    critical_path = [task_id for task_id in sorted_tasks if slack[task_id] == 0]

    # Format task details for the response
    task_details = []
    for task_id in sorted_tasks:
        task_details.append({
            'id': task_id,
            'es': es[task_id],
            'ef': ef[task_id],
            'ls': ls[task_id],
            'lf': lf[task_id],
            'slack': slack[task_id]
        })

    return {
        'project_duration': project_duration,
        'critical_path': critical_path,
        'tasks': task_details
    }

def _topological_sort(tasks: List[CPMTask]) -> List[int]:
    """Performs a topological sort on the tasks."""
    task_map = {task.id: task for task in tasks}
    in_degree = {task.id: 0 for task in tasks}
    
    # Correctly calculating in-degrees
    for task in tasks:
        for dep_id in task.dependencies:
            if dep_id in task_map:
                in_degree[task.id] += 1
    
    # Correctly calculating in-degrees based on who depends on what
    in_degree = {t.id: 0 for t in tasks}
    adj = {t.id: [] for t in tasks}
    for t in tasks:
        for dep_id in t.dependencies:
            if dep_id in task_map:
                adj[dep_id].append(t.id)

    for t_id in adj:
        for neighbor_id in adj[t_id]:
            in_degree[neighbor_id] += 1
            
    queue = [task.id for task in tasks if in_degree[task.id] == 0]
    sorted_list = []
    
    while queue:
        u = queue.pop(0)
        sorted_list.append(u)
        
        for v_id in adj.get(u, []):
            in_degree[v_id] -= 1
            if in_degree[v_id] == 0:
                queue.append(v_id)
    
    if len(sorted_list) != len(tasks):
        raise ValueError("Graph has a cycle, topological sort not possible.")
    
    return sorted_list

def _get_successors(task_id: int, tasks: List[CPMTask]) -> List[CPMTask]:
    """Finds all tasks that depend on the given task_id."""
    successors = []
    for task in tasks:
        if task_id in task.dependencies:
            successors.append(task)
    return successors
