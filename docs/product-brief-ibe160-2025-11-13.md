# Product Brief: ibe160

**Date:** 2025-11-13
**Author:** BIP
**Context:** software development project

---

## Executive Summary

This product brief outlines the vision for 'ibe160', an AI-Driven Construction Project Management Simulator. The project addresses the challenge faced by students and early-career project managers who lack practical experience in managing complex construction projects. The proposed solution is an interactive, AI-enhanced web platform that simulates construction projects, combining classical project management algorithms (like CPM) with modern AI-powered analysis. The primary users are students, with instructors and trainee project managers as secondary users. The MVP focuses on a three-phase workflow: Setup, Simulation, and Analysis, with clear success criteria and key performance indicators. The technical stack is a modular full-stack design using React, FastAPI, and PostgreSQL, with a 6-week implementation timeline. Key risks include complex Gantt chart integration and algorithm accuracy, with mitigation strategies in place.

---

## Core Vision

### Problem Statement

Construction projects are inherently complex, requiring a balance between time, cost, resources, and risk. Students and early-career project managers often learn these concepts theoretically, but lack the opportunity to experience how small planning decisions affect overall project performance in practice.

{{#if problem_impact}}

### Problem Impact

Traditional teaching methods in project management rely heavily on static charts, spreadsheets, and manual calculations. These approaches fail to capture the dynamic and interdependent nature of real construction projects. Delays, resource bottlenecks, and unforeseen risks are often treated as isolated examples rather than systemic factors.
{{/if}}

{{#if existing_solutions_gaps}}

### Why Existing Solutions Fall Short

Traditional teaching methods in project management rely heavily on static charts, spreadsheets, and manual calculations. These approaches fail to capture the dynamic and interdependent nature of real construction projects.
{{/if}}

### Proposed Solution

This project proposes an interactive, AI-enhanced web platform that allows users to design, execute, and analyze simulated construction projects. The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment. The end goal is to enable users to develop intuition for project planning, scheduling, and risk management through interactive experimentation rather than static instruction.

{{#if key_differentiators}}

### Key Differentiators

The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment.
{{/if}}

---

## Target Users

### Primary Users

**Persona 1 – The Student**
- **Profile:** Undergraduate or graduate construction management student.
- **Goal:** Understand the relationship between resource allocation, scheduling, and project outcomes.
- **Challenge:** Lacks opportunities for hands-on practice.
- **Value:** Gains experience through guided simulation and immediate visual feedback.

{{#if secondary_user_segment}}

### Secondary Users

**Persona 2 – The Instructor**
- **Profile:** University professor or teaching assistant in project management.
- **Goal:** Create controlled scenarios to assess students’ understanding of project dynamics.
- **Challenge:** Limited availability of interactive teaching tools.
- **Value:** Gains a flexible platform for demonstrations and comparative evaluation.

**Persona 3 – The Trainee Project Manager (Post-MVP)**
- **Profile:** Entry-level professional in construction or engineering project management.
- **Goal:** Experiment with decision strategies under realistic constraints.
- **Value:** Safe environment for improving planning accuracy and analytical reasoning.
{{/if}}

{{#if user_journey}}

### User Journey

{{user_journey}}
{{/if}}

---

{{#if success_metrics}}

## Success Metrics

{{success_metrics}}

{{#if business_objectives}}

### Business Objectives

{{business_objectives}}
{{/if}}

{{#if key_performance_indicators}}

### Key Performance Indicators

| Metric | Formula | Description |
|:--------|:----------|:-------------|
| **Schedule Variance (SV)** | EV − PV | Measures schedule adherence. |
| **Cost Variance (CV)** | EV − AC | Tracks cost efficiency. |
| **Risk Exposure Index (REI)** | Σ(probability × normalized impact) | Quantifies total risk burden. |

The dashboard visualizes these KPIs through color-coded indicators and trend lines for continuous tracking.
{{/if}}
{{/if}}

---

## MVP Scope

### Core Features

The platform follows a structured workflow divided into three main phases:

### Phase 1: Setup
Users create a new project and define:
- Work Breakdown Structure (WBS) with task dependencies.
- Budget, duration, and available resources.
- Risk factors with probability and impact metrics.

Input validation ensures that project logic is consistent (e.g., no cyclic dependencies, positive durations, and budget limits).

### Phase 2: Simulation
Once the baseline schedule is established using CPM, users initiate a simulation run.
Risk events are applied randomly based on probability values, and the simulator adjusts task durations and costs dynamically.
As the simulation progresses, a Gantt chart and performance dashboard update in real time to reflect changes in project status.

### Phase 3: Analysis
The system computes and visualizes key performance indicators (KPIs):
- Schedule Variance (SV)
- Cost Variance (CV)
- Risk Exposure Index (REI)

An integrated AI component analyzes results and provides contextual feedback, including explanations and recommended mitigation actions.

{{#if out_of_scope}}

### Out of Scope for MVP

{{out_of_scope}}
{{/if}}

{{#if mvp_success_criteria}}

### MVP Success Criteria

- Users can complete the full *Setup → Simulate → Analyze* workflow successfully.
- KPIs are computed accurately and match expected textbook results.
- Gantt charts and KPI dashboards update within one second of event changes.
- System maintains stable operation across multiple sessions.
- AI-generated insights are contextually accurate and reproducible.
{{/if}}

{{#if future_vision_features}}

### Future Vision

{{future_vision_features}}
{{/if}}

---

{{#if market_analysis}}

## Market Context

{{market_analysis}}
{{/if}}

{{#if financial_considerations}}

## Financial Considerations

{{financial_considerations}}
{{/if}}

{{#if technical_preferences}}

## Technical Preferences

The application employs a modular full-stack design.

| Layer | Technology | Description |
|:------|:------------|:-------------|
| **Frontend** | React 18 + Vite | Provides a responsive, component-based UI with fast build times. |
| **UI / Visualization** | Material UI (MUI), DHTMLX Gantt, Recharts | Used for dashboards, charts, and interactive project visualization. |
| **State Management** | Redux Toolkit | Manages complex and interdependent simulation states. |
| **Backend** | FastAPI (Python 3.11) | Handles simulation logic, API endpoints, and AI integration. |
| **Database** | PostgreSQL 15 | Stores projects, tasks, risks, and simulation results. |
| **Async Processing** | Celery or RQ with Redis | Handles long-running simulations without blocking API responses. |
| **Authentication** | Firebase Auth (Email + Google OAuth) | Provides secure login and role-based access. |
| **Hosting** | Vercel (Frontend), Render or Heroku (Backend) | Provides scalable deployment and CI/CD integration. |
{{/if}}

{{#if organizational_context}}

## Organizational Context

{{organizational_context}}
{{/if}}

{{#if risks_and_assumptions}}

## Risks and Assumptions

| Risk | Likelihood | Impact | Mitigation Strategy |
|:------|:------------|:--------|:--------------------|
| Complex Gantt chart integration | Medium | High | Build a prototype early and test library limitations. |
| Algorithm accuracy issues | Medium | High | Validate CPM results against standard examples and unit tests. |
| Scope creep | High | High | Enforce MVP scope with feature toggles and milestone checkpoints. |
| Hosting limitations | Low | Medium | Use staging environments and load testing to assess performance. |
{{/if}}

{{#if timeline_constraints}}

## Timeline

| Week | Focus | Key Deliverables |
|:------|:-------|:----------------|
| **Week 1** | Setup & Authentication | Initialize Vite + FastAPI stack; configure Firebase Auth and CI/CD pipeline. |
| **Week 2** | Database & CRUD | Finalize PostgreSQL schema; implement CRUD APIs for projects, tasks, and risks. |
| **Week 3** | Visualization | Integrate Gantt chart and KPI visualization components. |
| **Week 4** | Simulation Engine | Implement CPM and risk simulation logic with Celery worker integration. |
| **Week 5** | Analytics & AI | Implement real-time KPI updates and AI-based recommendations. |
| **Week 6** | Testing & Deployment | Conduct QA testing, optimize performance, and deploy to Vercel/Render. |
{{/if}}

{{#if supporting_materials}}

## Supporting Materials

- Initial Project Proposal: `proposalv3.md`
{{/if}}

---

_This Product Brief captures the vision and requirements for ibe160._

_It was created through collaborative discovery and reflects the unique needs of this {{context_type}} project._

{{#if next_workflow}}
_Next: {{next_workflow}} will transform this brief into detailed planning artifacts._
{{else}}
_Next: Use the PRD workflow to create detailed product requirements from this brief._
{{/if}}
