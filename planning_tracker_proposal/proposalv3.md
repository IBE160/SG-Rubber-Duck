# **AI-Driven Construction Project Management Simulator — Detailed Project Proposal**
**Team:** The Rubber Duck Debuggers  
**File:** project_proposal.md  

---

## **1. Project Overview**
Construction projects are inherently complex, requiring a balance between time, cost, resources, and risk.  
Students and early-career project managers often learn these concepts theoretically, but lack the opportunity to experience how small planning decisions affect overall project performance in practice.  

This project proposes an interactive, AI-enhanced web platform that allows users to design, execute, and analyze simulated construction projects.  
The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment.  

The end goal is to enable users to develop intuition for project planning, scheduling, and risk management through interactive experimentation rather than static instruction.

---

## **2. Purpose and Educational Value**
The simulator aims to transform the way project management is taught and practiced.  

**Educational Purpose:**  
To provide students with an interactive tool that demonstrates the cause-and-effect relationship between planning decisions and project outcomes.  

**Professional Purpose:**  
To serve as a virtual training ground for emerging project managers, allowing them to test and refine strategies without real-world consequences.  

This approach bridges the gap between theoretical knowledge and practical application by providing a safe, data-driven simulation environment.

---

## **3. Core Problem and Solution**
### **The Problem**
Traditional teaching methods in project management rely heavily on static charts, spreadsheets, and manual calculations. These approaches fail to capture the dynamic and interdependent nature of real construction projects.  
Delays, resource bottlenecks, and unforeseen risks are often treated as isolated examples rather than systemic factors.

### **The Solution**
The proposed system introduces a digital simulator that models these dynamics realistically.  
Users can define a full project scope—including tasks, dependencies, resources, and risks—then run simulations where the system automatically calculates outcomes using CPM and stochastic risk models.  

The result is a living, interactive representation of how planning choices influence key metrics such as cost, schedule, and risk exposure.

---

## **4. Target Users and Personas**
### **Persona 1 – The Student**
- **Profile:** Undergraduate or graduate construction management student.  
- **Goal:** Understand the relationship between resource allocation, scheduling, and project outcomes.  
- **Challenge:** Lacks opportunities for hands-on practice.  
- **Value:** Gains experience through guided simulation and immediate visual feedback.  

### **Persona 2 – The Instructor**
- **Profile:** University professor or teaching assistant in project management.  
- **Goal:** Create controlled scenarios to assess students’ understanding of project dynamics.  
- **Challenge:** Limited availability of interactive teaching tools.  
- **Value:** Gains a flexible platform for demonstrations and comparative evaluation.  

### **Persona 3 – The Trainee Project Manager (Post-MVP)**
- **Profile:** Entry-level professional in construction or engineering project management.  
- **Goal:** Experiment with decision strategies under realistic constraints.  
- **Value:** Safe environment for improving planning accuracy and analytical reasoning.

---

## **5. Functional Overview**
The platform follows a structured workflow divided into three main phases:

### **Phase 1: Setup**
Users create a new project and define:
- Work Breakdown Structure (WBS) with task dependencies.
- Budget, duration, and available resources.
- Risk factors with probability and impact metrics.

Input validation ensures that project logic is consistent (e.g., no cyclic dependencies, positive durations, and budget limits).

### **Phase 2: Simulation**
Once the baseline schedule is established using CPM, users initiate a simulation run.  
Risk events are applied randomly based on probability values, and the simulator adjusts task durations and costs dynamically.  
As the simulation progresses, a Gantt chart and performance dashboard update in real time to reflect changes in project status.

### **Phase 3: Analysis**
The system computes and visualizes key performance indicators (KPIs):
- Schedule Variance (SV)  
- Cost Variance (CV)  
- Risk Exposure Index (REI)  

An integrated AI component analyzes results and provides contextual feedback, including explanations and recommended mitigation actions.

---

## **6. Technical Architecture**
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

---

## **7. Core Algorithms**
### **Critical Path Method (CPM)**
- Constructs a Directed Acyclic Graph (DAG) from user-defined tasks.  
- Performs topological sorting to identify dependencies.  
- Calculates early and late start/finish times for each task.  
- Identifies tasks with zero float (the critical path).  

### **Resource Leveling (Heuristic)**
- Applies a greedy algorithm to redistribute non-critical tasks within available float.  
- Reduces peak resource overload while maintaining schedule feasibility.  

### **Risk Simulation**
- Performs probabilistic event generation using Bernoulli sampling.  
- Each triggered event modifies relevant task durations and costs.  
- The system logs every event with timestamps and recalculates project metrics in real time.

---

## **8. Key Performance Indicators (KPIs)**
| Metric | Formula | Description |
|:--------|:----------|:-------------|
| **Schedule Variance (SV)** | EV − PV | Measures schedule adherence. |
| **Cost Variance (CV)** | EV − AC | Tracks cost efficiency. |
| **Risk Exposure Index (REI)** | Σ(probability × normalized impact) | Quantifies total risk burden. |

The dashboard visualizes these KPIs through color-coded indicators and trend lines for continuous tracking.

---

## **9. AI Integration**
The AI module adds a layer of interpretation and recommendation to simulation results.

### **Mechanism**
1. The backend sends a structured project snapshot to the Gemini API after each simulation run.  
2. Gemini analyzes critical paths, risk exposure, and cost deviations.  
3. The model returns human-readable recommendations focused on corrective actions and risk mitigation.  

### **Example Output**
- “Task 4 is frequently delayed due to resource constraints. Consider reallocating Resource B or extending its capacity.”  
- “High risk of cost overrun in procurement phase. Recommend increasing contingency by 10%.”

AI responses are cached for ten minutes to minimize API calls and improve responsiveness.

---

## **10. Data Model Overview**
| Table | Description |
|:-------|:-------------|
| **Projects** | Core entity containing project metadata (budget, start and end dates). |
| **Tasks** | Defines task hierarchy, dependencies, cost, and duration. |
| **Resources** | Lists available labor and equipment with unit cost and capacity. |
| **Risks** | Defines potential risk events with probability and impact metrics. |
| **Simulation Runs** | Tracks each simulation instance (status, seed, execution time). |
| **Simulation Logs** | Records each event triggered during simulation for audit and replay. |

---

## **11. Testing and Quality Assurance**
Testing ensures reliability, accuracy, and consistency of results.

- **Backend:** Implemented using `pytest` for unit and integration tests.  
  Focus areas include CPM accuracy, risk engine performance, and API stability.  
- **Frontend:** Tested with Vitest and React Testing Library to validate component behavior.  
- **End-to-End Testing:** Conducted via Playwright to verify that the user flow (*Setup → Simulate → Analyze*) works as intended.  
- **Validation Rules:** Enforced via Pydantic (backend) and Zod (frontend).

---

## **12. Accessibility, Security, and Performance**
- **Accessibility:** Semantic HTML, ARIA roles, and keyboard navigation for all key functions.  
- **Security:** Firebase token verification, HTTPS encryption, rate limiting, and input sanitization.  
- **Performance:**  
  - Server-side pagination for large datasets.  
  - Redis caching for frequently accessed endpoints (e.g., KPIs).  
  - Asynchronous processing for simulations.  
  - Code-splitting to improve frontend loading times.

---

## **13. Implementation Timeline (6 Weeks)**
| Week | Focus | Key Deliverables |
|:------|:-------|:----------------|
| **Week 1** | Setup & Authentication | Initialize Vite + FastAPI stack; configure Firebase Auth and CI/CD pipeline. |
| **Week 2** | Database & CRUD | Finalize PostgreSQL schema; implement CRUD APIs for projects, tasks, and risks. |
| **Week 3** | Visualization | Integrate Gantt chart and KPI visualization components. |
| **Week 4** | Simulation Engine | Implement CPM and risk simulation logic with Celery worker integration. |
| **Week 5** | Analytics & AI | Implement real-time KPI updates and AI-based recommendations. |
| **Week 6** | Testing & Deployment | Conduct QA testing, optimize performance, and deploy to Vercel/Render. |

---

## **14. Success Criteria**
- Users can complete the full *Setup → Simulate → Analyze* workflow successfully.  
- KPIs are computed accurately and match expected textbook results.  
- Gantt charts and KPI dashboards update within one second of event changes.  
- System maintains stable operation across multiple sessions.  
- AI-generated insights are contextually accurate and reproducible.

---

## **15. Risks and Mitigation**
| Risk | Likelihood | Impact | Mitigation Strategy |
|:------|:------------|:--------|:--------------------|
| Complex Gantt chart integration | Medium | High | Build a prototype early and test library limitations. |
| Algorithm accuracy issues | Medium | High | Validate CPM results against standard examples and unit tests. |
| Scope creep | High | High | Enforce MVP scope with feature toggles and milestone checkpoints. |
| Hosting limitations | Low | Medium | Use staging environments and load testing to assess performance. |

---

## **16. Expected Outcomes**
Upon completion, the simulator will serve as an innovative educational and analytical tool, demonstrating how AI and data-driven modeling can enhance traditional project management training.  

Expected deliverables include:
- A fully functional web platform with integrated simulation and analytics.  
- A scalable technical architecture suitable for further research or commercial adaptation.  
- Documented datasets and codebase for reproducibility and academic evaluation.  

The system ultimately aims to redefine project management education by making complex project dynamics **visible, measurable, and understandable**.

---

**End of Proposal**


