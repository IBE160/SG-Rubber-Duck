# Technical Specification for Epic E1: Backend & Data Foundations

## Epic Overview
**Epic ID:** E1
**Title:** Backend & Data Foundations
**Description:** Establish the core backend infrastructure using FastAPI, define the PostgreSQL database schema with SQLAlchemy, implement CRUD operations for fundamental entities (Projects, Tasks, Risks), and set up robust database migration management using Alembic.

## Technical Requirements & Design Considerations

### 1. FastAPI Application Setup
*   **Framework:** FastAPI
*   **Project Structure:** Organize the application into logical modules (e.g., `main.py`, `database.py`, `models.py`, `schemas.py`, `crud.py`, `routers/`).
*   **Dependencies:** `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary` (for PostgreSQL), `alembic`, `pydantic`.
*   **Configuration:** Use environment variables for sensitive data (database credentials, etc.) and application settings. `dotenv` for local development.

### 2. Database Schema Definition (SQLAlchemy)
*   **Database:** PostgreSQL
*   **ORM:** SQLAlchemy 2.0+
*   **Core Models:**
    *   **Project:**
        *   `id`: Primary key (UUID or auto-incrementing integer).
        *   `name`: String, required.
        *   `description`: String, optional.
        *   `created_at`, `updated_at`: Timestamps.
    *   **Task:**
        *   `id`: Primary key.
        *   `project_id`: Foreign key to Project.
        *   `name`: String, required.
        *   `description`: String, optional.
        *   `duration`: Integer, required (in days/hours).
        *   `dependencies`: Relationship to other Tasks (self-referencing many-to-many or a separate dependency table). *Initial MVP will focus on simple task creation without complex dependency management in CRUD, to be handled by CPM engine.*
        *   `created_at`, `updated_at`.
    *   **Risk:**
        *   `id`: Primary key.
        *   `project_id`: Foreign key to Project.
        *   `name`: String, required.
        *   `description`: String, optional.
        *   `probability`: Enum/Float (Low, Medium, High / 0-1).
        *   `impact`: Enum/Float (Low, Medium, High / cost/time impact).
        *   `created_at`, `updated_at`.
    *   **SimulationRun:**
        *   `id`: Primary key.
        *   `project_id`: Foreign key to Project.
        *   `start_time`, `end_time`: Timestamps.
        *   `status`: Enum (pending, running, completed, failed).
        *   `final_kpis`: JSONB field for storing summarized KPI data.
        *   `created_at`, `updated_at`.
    *   **EventLog:**
        *   `id`: Primary key.
        *   `simulation_run_id`: Foreign key to SimulationRun.
        *   `timestamp`: Datetime.
        *   `event_type`: String (e.g., 'task_started', 'risk_triggered').
        *   `details`: JSONB for event-specific data.
        *   `created_at`.
*   **Relationships:** Define appropriate relationships (e.g., `Project` has many `Tasks`, `Risks`, `SimulationRuns`).
*   **Pydantic Models:** Create Pydantic `BaseModel` classes for request and response serialization/deserialization for all entities (`Create`, `Update`, `Read` schemas).

### 3. CRUD Operations
*   **Implementation:** Use SQLAlchemy session to interact with the database.
*   **`crud.py` Module:** Centralize database interaction logic (create, read, update, delete).
*   **Endpoints:**
    *   `/projects`: `GET` (list), `POST` (create).
    *   `/projects/{project_id}`: `GET` (retrieve), `PUT` (update), `DELETE`.
    *   `/projects/{project_id}/tasks`: `GET` (list tasks for project), `POST` (create task for project).
    *   `/tasks/{task_id}`: `GET` (retrieve), `PUT` (update), `DELETE`.
    *   `/projects/{project_id}/risks`: `GET` (list risks for project), `POST` (create risk for project).
    *   `/risks/{risk_id}`: `GET` (retrieve), `PUT` (update), `DELETE`.
*   **Error Handling:** Implement FastAPI's `HTTPException` for standard error responses (404 Not Found, 400 Bad Request, etc.).

### 4. Database Migrations (Alembic)
*   **Setup:** Initialize Alembic for the project.
*   **Workflow:** Define a clear workflow for generating and applying migrations (e.g., `alembic revision --autogenerate -m "message"`, `alembic upgrade head`).
*   **Initial Migration:** Create an initial migration script to set up all defined tables.

### 5. Testing Strategy for E1
*   **Unit Tests:** For `crud.py` functions, Pydantic model validation.
*   **Integration Tests:** For FastAPI endpoints using `TestClient`, verifying database interactions (e.g., create a project, retrieve it, update it, delete it).
*   **Acceptance Criteria (from Epic):**
    *   CRUD works via API for Project, Task, Risk.
    *   PostgreSQL schema is correctly migrated and reflects models.
    *   Basic auth stub in place (though E5 handles full auth, E1 might have a simple bypass for dev).

## Open Questions & Dependencies
*   **Dependencies in Tasks:** Initial CRUD will not manage task dependencies directly. The CPM engine (E2) will handle this logic. Ensure `Task` model can store predecessor IDs for E2.
*   **Auth Stub:** How will the "basic auth stub" for E1 be implemented? (e.g., simple API key, or just unprotected endpoints for now). E5 will define full auth.

## Definition of Done
*   FastAPI application is runnable.
*   PostgreSQL database models defined and accessible via SQLAlchemy.
*   CRUD operations for Project, Task, Risk entities implemented and tested.
*   Alembic migrations are set up and an initial migration applied successfully.
*   Unit and integration tests pass for core E1 functionalities.
*   Documentation updated for API endpoints.
