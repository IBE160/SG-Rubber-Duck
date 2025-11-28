"""
Critical Path Method (CPM) Calculation Logic

This module implements the Critical Path Method algorithm for project scheduling.
It calculates:
- Forward pass (earliest start/finish times)
- Backward pass (latest start/finish times)
- Critical path (sequence of tasks that determines minimum project duration)
- Slack/float for each task
"""

from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import date, timedelta


@dataclass
class TaskInfo:
    """Internal representation of a task for CPM calculation"""
    id: int
    duration: int  # in days
    dependencies: List[int]  # task IDs this task depends on
    earliest_start: Optional[int] = None
    earliest_finish: Optional[int] = None
    latest_start: Optional[int] = None
    latest_finish: Optional[int] = None
    
    def __post_init__(self):
        if self.earliest_start is None:
            self.earliest_start = 0
        if self.earliest_finish is None:
            self.earliest_finish = self.earliest_start + self.duration


@dataclass
class CPMResult:
    """Result of CPM calculation"""
    critical_path: List[int]  # IDs of tasks on critical path
    project_duration: int  # Total project duration in days
    tasks_info: Dict[int, TaskInfo]  # Task information with computed values
    slack_per_task: Dict[int, int]  # Slack/float for each task


class CriticalPathCalculator:
    """
    Calculates the Critical Path Method for a project.
    
    Usage:
        calculator = CriticalPathCalculator()
        tasks = [
            TaskInfo(id=1, duration=3, dependencies=[]),
            TaskInfo(id=2, duration=5, dependencies=[1]),
            TaskInfo(id=3, duration=4, dependencies=[1]),
        ]
        result = calculator.calculate(tasks)
        print(f"Critical path: {result.critical_path}")
        print(f"Project duration: {result.project_duration} days")
    """
    
    def calculate(self, tasks: List[TaskInfo]) -> CPMResult:
        """
        Calculate the critical path and task schedules.
        
        Args:
            tasks: List of TaskInfo objects with task details
            
        Returns:
            CPMResult with critical path and timing information
        """
        if not tasks:
            return CPMResult(
                critical_path=[],
                project_duration=0,
                tasks_info={},
                slack_per_task={}
            )
        
        # Create a dictionary for easier lookup
        tasks_dict = {task.id: task for task in tasks}
        
        # Forward pass: calculate earliest start and finish times
        self._forward_pass(tasks_dict)
        
        # Get project duration
        project_duration = max(task.earliest_finish for task in tasks_dict.values())
        
        # Backward pass: calculate latest start and finish times
        self._backward_pass(tasks_dict, project_duration)
        
        # Calculate slack for each task
        slack_per_task = {
            task_id: task.latest_start - task.earliest_start
            for task_id, task in tasks_dict.items()
        }
        
        # Identify critical path (tasks with zero slack)
        critical_path = [
            task_id for task_id, slack in slack_per_task.items()
            if slack == 0
        ]
        
        # Sort critical path by dependency order
        critical_path = self._sort_by_dependency(critical_path, tasks_dict)
        
        return CPMResult(
            critical_path=critical_path,
            project_duration=project_duration,
            tasks_info=tasks_dict,
            slack_per_task=slack_per_task
        )
    
    def _forward_pass(self, tasks_dict: Dict[int, TaskInfo]) -> None:
        """
        Forward pass: calculate earliest start and finish times.
        Tasks are processed in dependency order.
        """
        processed = set()
        while len(processed) < len(tasks_dict):
            for task_id, task in tasks_dict.items():
                if task_id in processed:
                    continue
                
                # Check if all dependencies are processed
                if all(dep_id in processed for dep_id in task.dependencies):
                    if not task.dependencies:
                        # No dependencies - starts at day 0
                        task.earliest_start = 0
                    else:
                        # Start after all dependencies finish
                        task.earliest_start = max(
                            tasks_dict[dep_id].earliest_finish
                            for dep_id in task.dependencies
                        )
                    
                    task.earliest_finish = task.earliest_start + task.duration
                    processed.add(task_id)
    
    def _backward_pass(self, tasks_dict: Dict[int, TaskInfo], project_duration: int) -> None:
        """
        Backward pass: calculate latest start and finish times.
        Works backwards from project end date.
        """
        # Initialize latest finish times
        for task_id, task in tasks_dict.items():
            task.latest_finish = project_duration
        
        # Find tasks with no successors (end tasks)
        all_dependencies = set()
        for task in tasks_dict.values():
            all_dependencies.update(task.dependencies)
        
        end_tasks = [task_id for task_id in tasks_dict.keys() if task_id not in all_dependencies]
        
        # Set latest finish for end tasks to project duration
        for task_id in end_tasks:
            task = tasks_dict[task_id]
            task.latest_finish = project_duration
        
        # Process all tasks, working backwards
        processed = set()
        while len(processed) < len(tasks_dict):
            for task_id, task in tasks_dict.items():
                if task_id in processed:
                    continue
                
                # Check if all dependent tasks (successors) are processed
                dependent_tasks = [
                    tid for tid, t in tasks_dict.items()
                    if task_id in t.dependencies
                ]
                
                if all(tid in processed for tid in dependent_tasks):
                    if not dependent_tasks:
                        # End task
                        task.latest_finish = project_duration
                    else:
                        # Latest finish is minimum of dependent tasks' latest start
                        task.latest_finish = min(
                            tasks_dict[dep_id].latest_start
                            for dep_id in dependent_tasks
                        )
                    
                    task.latest_start = task.latest_finish - task.duration
                    processed.add(task_id)
    
    def _sort_by_dependency(self, task_ids: List[int], tasks_dict: Dict[int, TaskInfo]) -> List[int]:
        """Sort task IDs in dependency order for the critical path."""
        sorted_path = []
        processed = set()
        
        while len(processed) < len(task_ids):
            for task_id in task_ids:
                if task_id in processed:
                    continue
                
                task = tasks_dict[task_id]
                # Add if all dependencies are processed
                if all(dep_id in processed or dep_id not in task_ids for dep_id in task.dependencies):
                    sorted_path.append(task_id)
                    processed.add(task_id)
        
        return sorted_path


def calculate_cpm(
    tasks: List[Dict],
    start_date: date
) -> Dict:
    """
    High-level function to calculate CPM and convert to calendar dates.
    
    Args:
        tasks: List of dicts with keys: id, duration, dependencies
        start_date: Project start date
        
    Returns:
        Dict with critical path info and task schedules
    """
    # Convert to TaskInfo objects
    task_list = [
        TaskInfo(
            id=t['id'],
            duration=t['duration'],
            dependencies=t.get('dependencies', [])
        )
        for t in tasks
    ]
    
    # Calculate CPM
    calculator = CriticalPathCalculator()
    result = calculator.calculate(task_list)
    
    # Convert to calendar dates
    task_schedules = {}
    for task_id, task_info in result.tasks_info.items():
        task_schedules[task_id] = {
            'earliest_start': (start_date + timedelta(days=task_info.earliest_start)).isoformat(),
            'earliest_finish': (start_date + timedelta(days=task_info.earliest_finish - 1)).isoformat(),
            'latest_start': (start_date + timedelta(days=task_info.latest_start)).isoformat(),
            'latest_finish': (start_date + timedelta(days=task_info.latest_finish - 1)).isoformat(),
            'slack': result.slack_per_task[task_id],
            'on_critical_path': task_id in result.critical_path
        }
    
    project_end_date = start_date + timedelta(days=result.project_duration - 1)
    
    return {
        'critical_path': result.critical_path,
        'project_duration_days': result.project_duration,
        'start_date': start_date.isoformat(),
        'end_date': project_end_date.isoformat(),
        'task_schedules': task_schedules
    }
