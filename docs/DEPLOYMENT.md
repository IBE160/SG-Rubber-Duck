# Deployment Guide — SG-Rubber-Duck

## Backend (FastAPI)
1) Env: set `DATABASE_URL` (Postgres for prod; e.g. `postgresql+psycopg2://user:pass@host:5432/db`). For local dev/test, SQLite fallback works: `sqlite:///./app.db`.
2) Install deps: `cd backend && ./venv/bin/pip install -r requirements.txt`
3) Migrations: `DATABASE_URL=... ./venv/bin/alembic upgrade head`
4) Run server: `PYTHONPATH=.. DATABASE_URL=... ./venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8001`
5) Health check: `curl http://localhost:8001/health`

## Frontend (React/Vite)
1) Env: set `VITE_API_BASE_URL` (e.g. `http://localhost:8001`).
2) Install deps: `cd frontend && npm install`
3) Dev server: `npm run dev`
4) Build: `npm run build`
5) Preview: `npm run preview`

## Tests
Backend: `PYTHONPATH=. DATABASE_URL=sqlite:///./backend/test.db ./backend/venv/bin/pytest`
Frontend: `npm run build` (and optionally lint/tests if added).

## Notes
- Ensure migrations are run before starting backend.
- For production, use Postgres, not SQLite; configure CORS and secrets via env.
