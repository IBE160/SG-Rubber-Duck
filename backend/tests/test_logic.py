import pytest
from backend.logic import calculate_cpm, CPMTask

def test_calculate_cpm_simple_path():
    """
    Tests a simple linear project: A -> B -> C
    """
    tasks = [
        CPMTask(id=1, duration=3, cost=0, dependencies=[]),
        CPMTask(id=2, duration=5, cost=0, dependencies=[1]),
        CPMTask(id=3, duration=2, cost=0, dependencies=[2]),
    ]
    
    result = calculate_cpm(tasks)
    
    assert result['project_duration'] == 10
    assert result['critical_path'] == [1, 2, 3]
    
    task_details = {t['id']: t for t in result['tasks']}
    
    # Task 1
    assert task_details[1]['es'] == 0
    assert task_details[1]['ef'] == 3
    assert task_details[1]['ls'] == 0
    assert task_details[1]['lf'] == 3
    assert task_details[1]['slack'] == 0
    
    # Task 2
    assert task_details[2]['es'] == 3
    assert task_details[2]['ef'] == 8
    assert task_details[2]['ls'] == 3
    assert task_details[2]['lf'] == 8
    assert task_details[2]['slack'] == 0
    
    # Task 3
    assert task_details[3]['es'] == 8
    assert task_details[3]['ef'] == 10
    assert task_details[3]['ls'] == 8
    assert task_details[3]['lf'] == 10
    assert task_details[3]['slack'] == 0

def test_calculate_cpm_with_float():
    """
    Tests a project with a non-critical path (a "floater" task).
    A -> B
    |
    -> C
    """
    tasks = [
        CPMTask(id=1, duration=5, cost=0, dependencies=[]),
        CPMTask(id=2, duration=4, cost=0, dependencies=[1]), # Critical
        CPMTask(id=3, duration=2, cost=0, dependencies=[1]), # Floater
    ]
    
    result = calculate_cpm(tasks)

    # Topological sort might vary, so we check path and duration
    assert result['project_duration'] == 9
    assert result['critical_path'] == [1, 2]

    task_details = {t['id']: t for t in result['tasks']}

    # Task 3 (the floater)
    assert task_details[3]['es'] == 5
    assert task_details[3]['ef'] == 7
    assert task_details[3]['ls'] == 7 # ls = lf - duration = 9 - 2
    assert task_details[3]['lf'] == 9 # lf of a final task is project duration
    assert task_details[3]['slack'] == 2 # slack = ls - es = 7 - 5

def test_calculate_cpm_cycle_detection():
    """
    Tests if the algorithm raises an error for a cyclic dependency.
    A -> B -> C -> A
    """
    tasks = [
        CPMTask(id=1, duration=2, cost=0, dependencies=[3]),
        CPMTask(id=2, duration=3, cost=0, dependencies=[1]),
        CPMTask(id=3, duration=4, cost=0, dependencies=[2]),
    ]
    
    with pytest.raises(ValueError, match="Graph has a cycle"):
        calculate_cpm(tasks)

def test_calculate_cpm_disconnected_tasks():
    """
    Tests two disconnected task chains.
    A -> B
    C -> D
    """
    tasks = [
        CPMTask(id=1, duration=5, cost=0, dependencies=[]),
        CPMTask(id=2, duration=4, cost=0, dependencies=[1]), # Chain 1 duration = 9
        CPMTask(id=3, duration=6, cost=0, dependencies=[]),
        CPMTask(id=4, duration=5, cost=0, dependencies=[3]), # Chain 2 duration = 11
    ]

    result = calculate_cpm(tasks)
    assert result['project_duration'] == 11
    assert result['critical_path'] == [3, 4]

    task_details = {t['id']: t for t in result['tasks']}
    assert task_details[1]['slack'] == 2
    assert task_details[2]['slack'] == 2
    assert task_details[3]['slack'] == 0
    assert task_details[4]['slack'] == 0
