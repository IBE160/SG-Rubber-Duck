from backend.database import SessionLocal
from backend.models import Task, Project

def check_project_dates(project_id):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            print(f"Project {project_id} not found.")
            return

        print(f"--- Project ID: {project.id} ---")
        print(f"Project Name: {project.name}")
        print(f"Project Start Date: {project.start_date}")

        tasks = db.query(Task).filter(Task.project_id == project_id).all()
        print(f"\n--- Tasks for Project {project_id} ---")
        for task in tasks:
            print(f"Task ID: {task.id}, Name: '{task.text}', Start Date: {task.start_date}")

    finally:
        db.close()

if __name__ == "__main__":
    check_project_dates(1)
