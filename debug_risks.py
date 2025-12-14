from backend.database import SessionLocal
from backend.models import Risk

def check_project_risks(project_id):
    db = SessionLocal()
    try:
        risks = db.query(Risk).filter(Risk.project_id == project_id).all()
        print(f"--- Checking Risks for Project ID: {project_id} ---")
        if not risks:
            print("No risks found for this project.")
            return

        for risk in risks:
            print(f"Risk ID: {risk.id}, Desc: '{risk.description}', Prob: {risk.probability}, Impact: {risk.duration_impact} days, Affected Tasks: {risk.affected_task_ids}")

    finally:
        db.close()

if __name__ == "__main__":
    check_project_risks(1)
