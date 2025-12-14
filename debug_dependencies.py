from backend.database import SessionLocal
from backend.models import Task, Project

def check_task_dependencies(project_id):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            print(f"Project {project_id} not found.")
            return

        tasks = db.query(Task).filter(Task.project_id == project_id).all()
        print(f"--- Checking Dependencies for Project: {project.name} (ID: {project_id}) ---")
        if not tasks:
            print("No tasks found for this project.")
            return

        for task in tasks:
            print(f"Task ID: {task.id}, Name: '{task.text}', Duration: {task.duration}, Dependencies: {task.dependencies}")

    finally:
        db.close()

if __name__ == "__main__":
    # Check for Project 1 as seen in the user's logs
    check_task_dependencies(1)
