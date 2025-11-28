# **AI-Driven Project Management Simulation (Construction Project)**
**Team:** *The Rubber Duck Debuggers*
**File:** `project description.md`

## **1. Background**
Managing construction projects involves a complex interplay between time, cost, resources, and risk.  
Students and junior professionals often struggle to understand how these variables interact dynamically.  
Traditional coursework alone is insufficient for developing real-world decision-making intuition.  

An interactive, AI-powered simulation can bridge this gap by offering a safe, sandboxed environment where users experience the cause-and-effect of their choices — learning how planning, risk, and execution intertwine.

---

## **2. Purpose**
The application simulates the planning and execution of construction projects, enabling users to explore how modern algorithms and AI support project management decisions.  
It focuses on scheduling, resource allocation, and risk management, providing **real-time visual and quantitative feedback** on user actions.

---

## **3. Target Users & Personas**

### **Persona 1 – The Student**
- **Name:** Sarah  
- **Profile:** 2nd-year construction-management student.  
- **Background:** Understands key PM concepts (WBS, Gantt charts) but lacks field experience.  
- **Goals:** Wants to see how resource and schedule decisions influence project outcomes in a low-risk, interactive setting.

### **Persona 2 – The Instructor**
- **Name:** Dr. Chen  
- **Profile:** University professor teaching advanced project management.  
- **Background:** Seeks engaging tools to complement lectures.  
- **Goals:** Wants to create tailored simulation scenarios, assess students’ decision-making, and compare outcomes across groups.

---

## **4. Core Functionality**

### **Must-Have (MVP)**
1. **Project Definition:** Users define scope, WBS, budget, timeline, and resource availability.  
2. **Deterministic Timeline Generation:** The system builds initial schedules using **Critical Path Method (CPM)**, visualized via interactive Gantt charts.  
3. **Dynamic Simulation:** Users trigger predefined risk events (e.g., supplier delays). The engine updates timelines and KPIs in real time.  
4. **Performance Dashboard:** Displays live KPIs — Schedule Variance (SV), Cost Variance (CV), Risk Exposure — offering immediate feedback.

### **Nice-to-Have (Post-MVP)**
5. **AI-Powered Recommendations:** Integrate a Gemini LLM for contextual advice on risk mitigation and optimization.  
6. **Multi-User Collaboration:** Enable shared project simulations.  
7. **Advanced Reporting:** Export logs, analytics, and performance summaries.

---

## **5. Technical Architecture**

### **5.1 Technology Stack**

| Layer | Technology | Rationale |
|:------|:------------|:-----------|
| **Frontend** | React + Vite | Component-based UI and fast dev environment |
| **UI / Visualization** | Material UI (MUI); DHTMLX Gantt | Professional design + robust scheduling visualization |
| **State Management** | Redux Toolkit | Predictable centralized state for complex simulation logic |
| **Backend** | Python + FastAPI | High-performance REST API; easy AI integration |
| **Database** | PostgreSQL | Reliable relational DB with schema integrity |
| **Auth** | Firebase Authentication | Fast, secure user management |
| **Hosting** | Vercel (frontend), Heroku (backend + DB) | Simplified CI/CD and scalable deployment |

---

### **5.2 System Architecture**
Standard client-server model:
- **Frontend (React)** communicates with **Backend (FastAPI)** via RESTful API.  
- Simulation logic resides on the backend for authoritative state management.  
- Long-running simulations execute asynchronously to maintain API responsiveness.

---

### **5.3 Database Schema**

| Table | Key Fields | Description |
|:------|:------------|:-------------|
| **Projects** | project_id, name, scope, budget, start_date, end_date | Master project data |
| **WBS_Tasks** | task_id, project_id FK, parent_task_id FK, name, duration, cost | Work breakdown hierarchy |
| **Resources** | resource_id, name, type, cost_rate | Resource pool |
| **Task_Assignments** | assignment_id, task_id FK, resource_id FK | Task-to-resource mapping |
| **Risks** | risk_id, project_id FK, description, probability, impact | Risk register |
| **Simulation_Logs** | log_id, project_id FK, timestamp, event_description, user_action | Event history |

---

### **5.4 AI Integration**

| Phase | Description |
|:------|:-------------|
| **MVP:** | Deterministic CPM + resource-leveling heuristics form the core simulation. |
| **Post-MVP:** | FastAPI backend sends structured project state to **Gemini API**, which returns natural-language recommendations (e.g., “Weather risk rising — allocate contingency for shelters”). |

---

## **6. User Authentication**
Implemented via **Firebase Auth** (Email/Password + Google OAuth).  
This approach ensures secure login without custom auth complexity, allowing developers to focus on simulation features.

---

## **7. Timeline & Milestones (6 Weeks)**

| Week | Deliverables |
|:-----|:--------------|
| **1** | Setup (Vite + FastAPI), CI/CD, Firebase Auth, basic login/logout |
| **2** | Database schema + CRUD for Projects and WBS tasks |
| **3** | Integrate DHTMLX Gantt and display backend WBS data |
| **4** | Core simulation engine (CPM algorithm); “Run Simulation” feature |
| **5** | Interactive simulation + real-time KPIs (CV/SV) |
| **6** | Testing, bug fixes, UI polish, deployment to Vercel/Heroku |

---

## **8. Risk Assessment & Mitigation**

| Risk | Likelihood | Impact | Mitigation |
|:------|:------------|:--------|:-------------|
| Complex Gantt integration | Medium | High | Allocate full Week 3; use DHTMLX docs & PoC early |
| Simulation inaccuracies | Medium | High | Validate CPM logic vs textbook examples; add unit tests |
| Timeline overrun | High | High | Stick to MVP scope; defer Nice-to-Haves; simplify KPIs if needed |

---

## **9. Success Criteria**
1. Users can create a project, define a WBS, and run a simulation end-to-end.  
2. The system visualizes and updates project timelines in the Gantt chart.  
3. KPIs for cost and schedule variance update correctly during simulations.  
4. The app is stable and performant throughout a typical session.
