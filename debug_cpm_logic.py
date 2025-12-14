from backend.logic import calculate_cpm, CPMTask

def test_cpm():
    # Scenario based on user's WBS
    # Project Start: 2025-12-12 (Day 0)
    # Task 1: Site Prep. Dur 5. Start 2025-12-12. Min Start Day = 0.
    # Task 2: Foundation. Dur 20. Start 2025-12-18 (Day 6). Min Start Day = 6. Dep: [1]
    # Task 3: Structural Steel. Dur 30. Start 2026-01-06 (Day 25). Min Start Day = 25. Dep: [1, 2]
    # Task 4: Ext Cladding. Dur 15. Start 2026-02-05 (Day 55). Min Start Day = 55. Dep: [1, 2, 3]
    # Task 5: Int Fit-out. Dur 25. Start 2026-02-20 (Day 70). Min Start Day = 70. Dep: [1, 2, 3, 4]
    # Task 6: Handover. Dur 1. Start ?. Dep: [5]? User said 1-3-5-6 is reality.
    # Let's assume Task 6 depends on 5.

    tasks = [
        CPMTask(id=1, duration=5, cost=0, dependencies=[], min_start_day=0),
        CPMTask(id=2, duration=20, cost=0, dependencies=[1], min_start_day=6),
        # Task 3 min_start_day derived from user input.
        # If user put Dec 24 in WBS, and Project is Dec 12.
        # Day 12. 
        # But previous logs showed ES 25 for Task 3.
        # Let's use the values that resulted in the 95 day duration.
        # T3 ES 25. T3 EF 55.
        # T5 ES 70. T5 EF 95.
        # T6? Let's add it.
        CPMTask(id=3, duration=30, cost=0, dependencies=[1, 2], min_start_day=25),
        CPMTask(id=4, duration=15, cost=0, dependencies=[1, 2, 3], min_start_day=55),
        CPMTask(id=5, duration=25, cost=0, dependencies=[1, 2, 3, 4], min_start_day=70),
        CPMTask(id=6, duration=1, cost=0, dependencies=[5], min_start_day=95), 
    ]

    result = calculate_cpm(tasks)
    
    print("--- CPM Calculation Results ---")
    print(f"Project Duration: {result['project_duration']}")
    print(f"Critical Path: {result['critical_path']}")
    print("\nTask Details:")
    for t in result['tasks']:
        print(f"ID: {t['id']}, ES: {t['es']}, EF: {t['ef']}, LS: {t['ls']}, LF: {t['lf']}, Slack: {t['slack']}")

if __name__ == "__main__":
    test_cpm()
