# Architecture — IBE160 Simulator

## Overview
- Stack: React (Vite) + MUI/Tailwind for UI; FastAPI for backend; PostgreSQL + SQLAlchemy for persistence; CPM-based engine + AI insights (OpenAI/Gemini).
- Real-time: WebSockets for simulation stream (progress, risks, KPIs); REST for CRUD (projects, tasks, risks, simulations).
- Hosting target: Vercel (frontend), Heroku/Render (backend) with managed Postgres.

## Frontend
- React + Vite; routing for `/setup`, `/simulation`, `/analysis`.
- State: Redux Toolkit or light alternative (Zustand) + TanStack Query for server state (fetch/cache of projects/tasks/risks).
- UI libs: MUI + Tailwind utility layer; DHTMLX Gantt (or similar) for real-time chart; KPI cards and event log tabs.
- WebSocket client for live simulation feed; HTTP for mutations (create project, start simulation).

## Backend
- FastAPI app with routers: `projects`, `tasks`, `risks`, `simulate`, `auth` (placeholder).
- Simulation service:
  - CPM for baseline schedule/critical path.
  - Risk/event engine applies delays/cost impacts, emits progress events.
  - Async WebSocket producer broadcasts task state, KPIs, event log entries.
- AI service:
  - Ingests project + simulation outcomes; calls LLM for insights/recommendations.
  - Returns structured summary (issues, causes, recommendations) to frontend.
- Background tasks with asyncio for non-blocking simulation runs.

## Data & Models
- Postgres entities: Project, Task (duration, predecessors, resources), Risk (probability, impact, scope), SimulationRun, EventLog.
- SQLAlchemy + Alembic migrations; indices on foreign keys and `SimulationRun` timestamps.
- Validation: Pydantic models; server-side checks for circular dependencies.

## Integration points
- **WebSocket:** `/ws/simulations/{run_id}` stream → frontend subscribes, updates Gantt/KPIs.
- **REST:** `POST /projects`, `POST /projects/{id}/tasks`, `POST /simulate` (returns `run_id` + WS URL), `GET /simulations/{run_id}` for final summary.
- **Auth (future):** Firebase/OpenID JWT validation middleware; guarded routes for mutations.

## Non-functional
- Observability: basic logging + request IDs; timing for simulation steps.
- Performance: limit concurrent simulations per user; cap project size (tasks, risks) for MVP.
- Security: input validation, CORS locked to frontend origin, secrets via env.

## Decisions & open items
- Realtime confirmed: WebSockets (per `proposalv3.1 technical architecture`).
- State mgmt: Redux Toolkit baseline; re-evaluate Zustand if boilerplate grows.
- AI provider: OpenAI or Gemini; keep adapter to swap provider.
