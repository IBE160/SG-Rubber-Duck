import sys
import os

# Add the project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base, Project, Task
from backend import crud, schemas
from datetime import date

# Database setup (use an in-memory SQLite for testing)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to get a DB session
def get_test_db():
    return next(get_db())

def run_dependency_test():
    print("--- Starting Dependency Persistence Test ---")
    db = get_test_db()

    try:
        # 1. Create a Project
        project_create = schemas.ProjectCreate(
            name="Test Project for Dependencies",
            description="A project to test task dependency persistence",
            budget=10000.0,
            contingency=0.1,
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31)
        )
        project = crud.create_project(db, project_create)
        print(f"Created project: {project.name} (ID: {project.id})")

        # 2. Create Task 1
        task_create_1 = schemas.TaskCreate(
            text="Task 1",
            start_date=date(2023, 1, 1),
            duration=5,
            cost=100.0,
            predecessors=[]
        )
        task_1 = crud.create_task(db, task_create_1, project.id)
        print(f"Created task 1: {task_1.text} (ID: {task_1.id})")

        # 3. Create Task 2
        task_create_2 = schemas.TaskCreate(
            text="Task 2",
            start_date=date(2023, 1, 8),
            duration=10,
            cost=200.0,
            predecessors=[]
        )
        task_2 = crud.create_task(db, task_create_2, project.id)
        print(f"Created task 2: {task_2.text} (ID: {task_2.id})")

        # 4. Update Task 2 with dependencies (Task 1)
        task_update_deps = schemas.TaskUpdate(dependencies=[task_1.id])
        updated_task_2 = crud.update_task(db, task_2.id, task_update_deps)
        print(f"Updated task 2 with dependencies: {updated_task_2.dependencies}")
        assert updated_task_2.dependencies == [task_1.id], "Dependency update failed initially."
        print("Assertion Passed: Dependencies correctly added.")

        # 5. Fetch Task 2 again to ensure persistence
        fetched_task_2_after_deps = db.query(Task).filter(Task.id == task_2.id).first()
        print(f"Fetched task 2 after dep update: {fetched_task_2_after_deps.dependencies}")
        assert fetched_task_2_after_deps.dependencies == [task_1.id], "Dependencies not persistent after initial update."
        print("Assertion Passed: Dependencies persistent after fetch.")

        # 6. Update Task 2's text without providing dependencies (mimicking frontend partial update)
        task_update_text = schemas.TaskUpdate(text="Task 2 - Renamed")
        updated_task_2_text = crud.update_task(db, task_2.id, task_update_text)
        print(f"Updated task 2 text: {updated_task_2_text.text}")
        print(f"Task 2 dependencies after text update: {updated_task_2_text.dependencies}")
        assert updated_task_2_text.text == "Task 2 - Renamed", "Text update failed."
        assert updated_task_2_text.dependencies == [task_1.id], "Dependencies were lost after partial text update."
        print("Assertion Passed: Dependencies preserved after partial text update.")

        # 7. Fetch Task 2 again after text update to confirm persistence
        fetched_task_2_after_text = db.query(Task).filter(Task.id == task_2.id).first()
        print(f"Fetched task 2 after text update: {fetched_task_2_after_text.dependencies}")
        assert fetched_task_2_after_text.dependencies == [task_1.id], "Dependencies not persistent after partial text update fetch."
        print("Assertion Passed: Dependencies persistent after partial text update fetch.")

    except AssertionError as e:
        print(f"Test Failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        # Clean up
        if 'project' in locals() and project:
            crud.delete_project(db, project.id)
            print(f"Cleaned up project {project.id}")
        db.close()
        print("--- Test Finished ---")

if __name__ == "__main__":
    run_dependency_test()
