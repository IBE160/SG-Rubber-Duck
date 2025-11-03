# AI-driven Project Management Simulation (Construction Project)


**Team:** The Rubber Duck Debuggers


---


## 1. Background


Managing construction projects involves a complex interplay of decisions related to time, cost, resources, and risk. Project management students and new professionals often struggle to grasp how these factors interact in a dynamic, real-world environment. Theoretical knowledge alone is insufficient to build intuition for handling unexpected delays, resource shortages, or budget overruns. An interactive simulation powered by AI can provide a safe, sandboxed learning environment where users can experience the direct consequences of their planning and execution choices, bridging the gap between theory and practice.


## 2. Purpose


The purpose of this application is to simulate the planning and execution of a construction project, allowing users to explore how modern algorithms and AI can support critical project management decisions. The platform will focus on scheduling, resource allocation, and risk management, providing immediate visual and quantitative feedback on user actions.


## 3. Target Users & Personas


The primary users are students and professionals learning project management, particularly within the construction industry.


*   **Persona 1: The Student**
    *   **Name:** Sarah, a 2nd-year construction management student.
    *   **Background:** Has foundational knowledge of project management concepts (WBS, Gantt charts) but lacks practical experience.
    *   **Goals:** Wants to understand how decisions about resource allocation and scheduling impact project timelines and budgets. She needs to see the cause-and-effect of her choices in a low-stakes environment.


*   **Persona 2: The Instructor**
    *   **Name:** Dr. Chen, a university professor teaching advanced project management.
    *   **Background:** Looks for engaging tools to supplement his curriculum.
    *   **Goals:** Wants to create tailored simulation scenarios to test his students' understanding of specific concepts like risk mitigation and resource leveling. He needs to assess their decision-making process and compare outcomes across the class.


## 4. Core Functionality


### Must-Have (MVP)
*   **Feature 1: Project Definition:** Users can input a project's scope, define a Work Breakdown Structure (WBS), and set key parameters such as budget, deadlines, and resource availability.
*   **Feature 2: Deterministic Timeline Generation:** The system generates initial project schedules using the Critical Path Method (CPM). Timelines are visualized as interactive Gantt charts.
*   **Feature 3: Dynamic Simulation:** Users can run project simulations where predefined risk events (e.g., "Supplier delay," "Unexpected site condition") can be triggered. The simulation engine updates the project state based on these events and user decisions.
*   **Feature 4: Performance Dashboard:** The UI displays key performance indicators (KPIs) in real-time, including schedule variance (SV), cost variance (CV), and risk exposure, providing immediate feedback.


### Nice to Have (Post-MVP Extensions)
*   **Feature 5: AI-Powered Recommendations:** Integrate an LLM to provide contextual advice for risk mitigation and resource optimization based on the current project state.
*   **Feature 6: Multi-User Collaboration:** Enable multiple users to manage the same project as a team.
*   **Feature 7: Advanced Reporting:** Allow users to export project reports, simulation logs, and performance analytics for post-mortem analysis.


## 5. Technical Architecture


### 5.1. Technology Stack
*   **Frontend:** **React** with **Vite**.
    *   *Why:* React's component-based architecture is ideal for building a complex, interactive UI. Vite provides a fast development experience.
*   **UI & Visualization:**
    *   **Component Library:** **Material-UI (MUI)** for a consistent and professional look and feel.
    *   **Gantt Chart Library:** **DHTMLX Gantt**.
        *   *Why:* It is a feature-rich, high-performance library specifically designed for complex scheduling visualizations, which is a core requirement.
    *   **State Management:** **Redux Toolkit**.
        *   *Why:* Provides a centralized and predictable state container, essential for managing the complex state of a simulation.
*   **Backend:** **Python** with **FastAPI**.
    *   *Why:* FastAPI offers high performance and is excellent for building RESTful APIs. Python's extensive libraries for data science and AI make it a natural choice for future AI integration.
*   **Database:** **PostgreSQL**.
    *   *Why:* A robust, open-source relational database that can enforce data integrity through schemas and easily handle the structured relationships between projects, tasks, resources, and simulation results.
*   **Platform & Hosting:**
    *   **Platform:** Web-based application, designed for desktop browsers (Chrome, Firefox, Edge).
    *   **Hosting:** **Vercel** for the frontend (for seamless CI/CD) and **Heroku** for the backend and database (for ease of deployment and management).


### 5.2. System Architecture
The system will use a standard client-server architecture. The React frontend will communicate with the FastAPI backend via a **RESTful API**. The simulation logic will reside on the backend, ensuring that all state changes are processed authoritatively. Long-running simulation steps will be handled asynchronously to prevent blocking the API.


### 5.3. Database Schema
The PostgreSQL database will use the following core tables with defined relationships:
*   `Projects` (project_id, name, scope, budget, start_date, end_date)
*   `WBS_Tasks` (task_id, project_id (FK), parent_task_id (FK), name, duration, cost)
*   `Resources` (resource_id, name, type, cost_rate)
*   `Task_Assignments` (assignment_id, task_id (FK), resource_id (FK))
*   `Risks` (risk_id, project_id (FK), description, probability, impact)
*   `Simulation_Logs` (log_id, project_id (FK), timestamp, event_description, user_action)


### 5.4. AI Integration
The term "AI-assisted" will be implemented as follows to ensure feasibility:
*   **MVP (Feature 2):** The core scheduling will use **deterministic algorithms** like the **Critical Path Method (CPM)** and basic resource leveling heuristics. This is not "AI" but is a necessary, complex foundation.
*   **Post-MVP (Feature 5):** True AI will be introduced via an external Large Language Model (**Gemini API**). The backend will send a structured prompt containing the current project state (e.g., active risks, budget status, resource conflicts) to the API. The LLM will return **natural language recommendations** for the user to consider (e.g., "Risk of weather delay is high. Consider allocating budget to rent temporary shelters.").


## 6. User Authentication
Authentication will be handled using **Firebase Authentication**.
*   *Why:* Implementing a secure authentication system from scratch is time-consuming and complex. Using a managed service like Firebase Auth allows us to quickly implement secure login (Email/Password and Google OAuth) and focus our limited development time on the core simulation features.


## 7. Timeline and Milestones (1.5 Months / 6 Weeks)


| Week   | Key Deliverables                                                              |
| :----- | :---------------------------------------------------------------------------- |
| **1**  | **Setup & Auth:** Project setup (Vite, FastAPI), CI/CD pipeline, Firebase authentication, and basic user login/logout functionality.                               |
| **2**  | **Project CRUD & DB:** Finalize DB schema. Implement full CRUD (Create, Read, Update, Delete) operations for Projects and WBS tasks via the API.                 |
| **3**  | **Gantt Chart Viz:** Integrate DHTMLX Gantt on the frontend. Display WBS tasks from the backend in a read-only Gantt chart.                                       |
| **4**  | **Core Simulation Engine:** Develop the backend simulation logic (CPM algorithm). Implement the "run simulation" feature that progresses the project timeline deterministically. |
| **5**  | **Interactivity & KPIs:** Enable user interaction in the simulation (e.g., responding to events). Implement and display real-time KPIs (cost/schedule variance) on the dashboard. |
| **6**  | **Testing & Refinement:** End-to-end testing, bug fixing, final UI polish, and deployment to Vercel/Heroku.                                                          |


## 8. Risk Assessment and Mitigation


| Risk                               | Likelihood | Impact | Mitigation Strategy                                                                                             |
| :--------------------------------- | :--------- | :----- | :-------------------------------------------------------------------------------------------------------------- |
| Gantt chart integration is complex | Medium     | High   | **Allocate Week 3 entirely to this task.** Use the DHTMLX Gantt library's official documentation and support forums. Start with a minimal proof-of-concept in Week 1. |
| Simulation logic is inaccurate     | Medium     | High   | **Focus on conceptual accuracy, not real-world precision.** Validate the CPM algorithm against textbook examples. Implement unit tests for all calculation logic. |
| Scope exceeds 1.5-month timeline   | High       | High   | **Adhere strictly to the MVP.** Defer all "Nice to Have" features. If needed, simplify Feature 4 (KPIs) to only show schedule variance initially. |


## 9. Success Criteria


The project will be considered successful if:
1.  Users can successfully create a project, define a WBS, and run a simulation from start to finish.
2.  The system accurately visualizes the project timeline on a Gantt chart and updates it based on simulation events.
3.  The performance dashboard correctly calculates and displays schedule and cost variance.
4.  The application is stable and runs efficiently without major crashes or performance degradation during a typical simulation session.


