# Epics — IBE160 Simulator

## E1 Backend & Data Foundations
- **Scope:** FastAPI app, Postgres schema (Project, Task, Risk, SimulationRun, EventLog), CRUD for projects/tasks/risks, migrations.
- **Key stories:** Spin up FastAPI; define models/schemas; endpoints for project/task/risk CRUD; Alembic migrations; seed/demo data.
- **Acceptance:** CRUD works via API; schema migrated; basic auth stub in place; tests cover models and endpoints.

## E2 Simulation Engine & Real-time
- **Scope:** CPM baseline, risk/event engine, simulation runner, WebSocket stream for progress/KPIs/log.
- **Key stories:** Compute critical path; apply probabilistic delays/costs; run async simulation; stream events over `/ws/simulations/{run_id}`; persist SimulationRun summary.
- **Acceptance:** Given a project with tasks/risks, simulation returns final KPIs and emits event log; critical path highlighted; concurrency tested.

## E3 Frontend UX (Setup, Simulation, Analysis)
- **Scope:** Implement wireframes for Setup (3-panel WBS builder), Simulation (Gantt + KPI/log tabs), Analysis (KPI cards + AI insights).
- **Key stories:** Routing `/setup` `/simulation` `/analysis`; WBS tree-table with dependencies; Simulation controls (Play/Pause/Stop, speed); Gantt visualization; KPI cards/log; Analysis view with final Gantt, cost/risk tabs, “Run New Simulation”.
- **Acceptance:** User can build WBS, start simulation, observe live updates, view analysis summary; responsive layout; keyboard/focus states.

## E4 AI Insights & Recommendations
- **Scope:** AI service adapter (OpenAI/Gemini), prompt construction from project + simulation outputs, UI panel for insights.
- **Key stories:** Backend endpoint to call LLM; structured response (issues, causes, recommendations); frontend panel with expandable items; feedback capture (thumbs/rating) for later tuning.
- **Acceptance:** Simulation results yield AI summary and recommended actions visible in Analysis; errors surfaced gracefully; adapter swappable.

## E5 Authentication & Security
- **Scope:** Firebase/OpenID integration, guarded routes, profile menu.
- **Key stories:** Auth middleware; login (email/Google); protect mutations; profile dropdown with logout; token refresh handling.
- **Acceptance:** Unauth users redirected; tokens validated server-side; secure storage of secrets/env.

## E6 Quality, Testing & Release
- **Scope:** Unit/integration tests, CI, deploy targets (Vercel frontend, Heroku/Render backend), performance/observability baseline.
- **Key stories:** Pytest for backend; frontend tests for key flows; CI pipeline; deployment scripts; logging/metrics.
- **Acceptance:** Green test suite; deployed preview for frontend/back; basic logs available; bundle size within target.
