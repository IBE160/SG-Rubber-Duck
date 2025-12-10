import requests
import datetime
import json

API_URL = "http://localhost:8001"

def create_demo_project():
    print("1. Creating Project...")
    start_date = datetime.date.today().isoformat()
    end_date = (datetime.date.today() + datetime.timedelta(days=120)).isoformat()
    
    project_data = {
        "name": "High-Rise Office Complex",
        "description": "Construction of a 20-story office building with modern amenities.",
        "budget": 5000000,
        "start_date": start_date,
        "end_date": end_date,
    }
    
    try:
        res = requests.post(f"{API_URL}/projects/", json=project_data)
        res.raise_for_status()
        project = res.json()
        pid = project["id"]
        print(f"Project created with ID: {pid}")
    except Exception as e:
        print(f"Failed to create project: {e}")
        if 'res' in locals():
            print(res.text)
        return

    print("2. Creating Tasks...")
    tasks = []
    task_data_list = [
        {"text": "Site Preparation", "duration": 10, "start_date": start_date, "progress": 0, "parent": None},
        {"text": "Foundation", "duration": 20, "start_date": start_date, "progress": 0, "parent": None},
        {"text": "Structural Steel", "duration": 30, "start_date": start_date, "progress": 0, "parent": None},
        {"text": "Exterior Cladding", "duration": 15, "start_date": start_date, "progress": 0, "parent": None},
        {"text": "Interior Fit-out", "duration": 25, "start_date": start_date, "progress": 0, "parent": None},
    ]

    for t_data in task_data_list:
        try:
            res = requests.post(f"{API_URL}/projects/{pid}/tasks/", json=t_data)
            res.raise_for_status()
            task = res.json()
            tasks.append(task)
            print(f"Task created: {task['text']} (ID: {task['id']})")
        except Exception as e:
            print(f"Failed to create task {t_data['text']}: {e}")
            if 'res' in locals():
                print(res.text)

    print("3. Linking Tasks...")
    # t2 -> t1
    # t3 -> t2
    # t4 -> t3
    # t5 -> t4
    
    links = [
        (tasks[1]['id'], [tasks[0]['id']]),
        (tasks[2]['id'], [tasks[1]['id']]),
        (tasks[3]['id'], [tasks[2]['id']]),
        (tasks[4]['id'], [tasks[3]['id']]),
    ]
    
    for tid, preds in links:
        try:
            # Replicating the frontend call: PATCH /tasks/{tid} with body { predecessors: preds }
            res = requests.patch(f"{API_URL}/tasks/{tid}", json={"predecessors": preds})
            res.raise_for_status()
            print(f"Task {tid} linked to {preds}")
        except Exception as e:
            print(f"Failed to link task {tid}: {e}")
            if 'res' in locals():
                print(res.text)

    print("4. Creating Risks...")
    risks = [
        {"description": "Severe Weather", "probability": 0.1, "impact": 'High', "duration_impact": 5, "affected_task_ids": []},
        {"description": "Supply Chain Delay", "probability": 0.2, "impact": 'Medium', "duration_impact": 10, "affected_task_ids": []},
    ]
    
    for r_data in risks:
        try:
            res = requests.post(f"{API_URL}/projects/{pid}/risks/", json=r_data)
            res.raise_for_status()
            print(f"Risk created: {r_data['description']}")
        except Exception as e:
            print(f"Failed to create risk {r_data['description']}: {e}")
            if 'res' in locals():
                print(res.text)

    print("5. Creating Resources...")
    resources = [
        {"name": "Construction Crew", "cost_per_day": 1000},
        {"name": "Crane", "cost_per_day": 500},
    ]
    
    for res_data in resources:
        try:
            # Frontend sends project_id in body too
            data_with_pid = res_data.copy()
            data_with_pid["project_id"] = pid
            res = requests.post(f"{API_URL}/projects/{pid}/resources/", json=data_with_pid)
            res.raise_for_status()
            print(f"Resource created: {res_data['name']}")
        except Exception as e:
            print(f"Failed to create resource {res_data['name']}: {e}")
            if 'res' in locals():
                print(res.text)

if __name__ == "__main__":
    create_demo_project()
