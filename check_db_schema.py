from sqlalchemy import create_engine, inspect
from backend.database import DATABASE_URL

# Force sqlite path if it's relative
if "sqlite" in DATABASE_URL and "app.db" in DATABASE_URL:
    # ensure we use the same file as backend
    pass

engine = create_engine("sqlite:///./app.db")
inspector = inspect(engine)

print("Tables:", inspector.get_table_names())

if "tasks" in inspector.get_table_names():
    cols = [c['name'] for c in inspector.get_columns("tasks")]
    print("Tasks columns:", cols)
    if "dependencies" not in cols:
        print("MISSING 'dependencies' column in 'tasks' table!")

if "resources" in inspector.get_table_names():
    cols = [c['name'] for c in inspector.get_columns("resources")]
    print("Resources columns:", cols)

if "risks" in inspector.get_table_names():
    cols = [c['name'] for c in inspector.get_columns("risks")]
    print("Risks columns:", cols)
