# ibe160 - Product Requirements Document

**Author:** BIP
**Date:** 2025-11-22
**Version:** 1.0

---

## Executive Summary

The project aims to transform project management education by providing an interactive, AI-enhanced web platform that simulates construction projects. It addresses the gap between theoretical learning and practical application, allowing students and emerging project managers to develop intuition for planning, scheduling, and risk management through dynamic experimentation and immediate feedback.

### What Makes This Special

Unlike traditional static methods, this simulator combines classical CPM algorithms with real-time AI-powered analysis, offering dynamic visual and quantitative feedback. Its integrated AI component provides contextual feedback, explanations, and recommended mitigation actions, creating a unique learning environment for interactive experimentation.

---

## Project Classification

**Technical Type:** web_app
**Domain:** edtech
**Complexity:** medium

The project is a Web Application (web_app) in the EdTech domain, focused on providing an AI-driven simulation for construction project management. It falls under medium complexity.

---

## Success Criteria

Winning for 'ibe160' means successfully enabling students and emerging project managers to develop intuitive project planning and risk management skills through interactive experimentation. Specifically:
*   Users can seamlessly complete the *Setup → Simulate → Analyze* workflow.
*   Simulation results (KPIs, Gantt charts, dashboards) are accurate, real-time, and align with textbook principles.
*   The system operates stably across sessions, with AI insights being contextually relevant and reproducible, fostering a deeper understanding of project dynamics and decision-making.

### Business Metrics

The success of the simulator will be measured through its core KPIs, reflecting adherence to project management principles within the simulation:
*   **Schedule Variance (SV):** Measures schedule adherence in simulated projects.
*   **Cost Variance (CV):** Tracks cost efficiency in simulated projects.
*   **Risk Exposure Index (REI):** Quantifies total risk burden in simulated projects.

---

## Product Scope

### MVP - Minimum Viable Product

The MVP will deliver a complete end-to-end user flow, enabling a single user to:
1.  **Setup:** Create a project, define a Work Breakdown Structure (WBS) with tasks and dependencies, set a budget, and specify resources and risks.
2.  **Simulate:** Run a simulation based on a CPM-generated schedule, where the system dynamically applies risk events and updates task durations and costs.
3.  **Analyze:** View real-time updates on a Gantt chart and a performance dashboard showing KPIs (SV, CV, REI), and receive contextual feedback and recommendations from an integrated AI assistant.

### Growth Features (Post-MVP)

Post-MVP, features will focus on expanding the simulation's depth and collaborative capabilities:
1.  **Advanced Simulations:** Incorporate resource leveling and what-if scenario planning.
2.  **Collaboration:** Allow multiple users to collaborate on a single project, with roles and permissions.
3.  **Advanced Analytics:** Introduce a dedicated reporting module with historical trend analysis and comparative analytics across multiple simulation runs.
4.  **Instructor-Specific Features:** Provide tools for instructors to create and manage assignments and assess student performance.
5.  **Integrations:** Offer integrations with common project management tools.

### Vision (Future)

The long-term vision is to create a comprehensive and autonomous project management learning ecosystem:
1.  **Autonomous AI Planner:** An AI agent that can independently run thousands of simulations to find an optimal project plan based on user-defined goals and constraints.
2.  **Digital Twin Integration:** Ability to connect to real-world project data to simulate ongoing projects and predict future outcomes.
3.  **Marketplace:** A platform for users to share and download simulation scenarios, risk models, and project templates for various industries.
4.  **Gamification:** Introduce leaderboards, achievements, and challenges to increase user engagement and learning.

---

## Innovation & Novel Patterns

The core innovation is the shift from passive to active learning in project management education. This is achieved through a novel interaction paradigm that combines:
1.  **Real-time Simulation:** Providing immediate visual and quantitative feedback on the consequences of planning decisions.
2.  **AI-Powered Feedback Loop:** An integrated AI assistant that doesn't just show *what* happened, but explains *why* and suggests improvements, acting as a virtual mentor.

### Validation Approach

Validation will be user-centric, focusing on learning outcomes. The primary success metric will be a demonstrable improvement in users' ability to optimize project KPIs (cost, schedule, risk) over successive simulation runs. This will be assessed through user testing with students. Additionally, the contextual relevance and accuracy of the AI-generated recommendations will be evaluated by domain experts (instructors and experienced project managers).

---

## web_app Specific Requirements

As a modern web application, the simulator must adhere to the following requirements:
*   **Architecture:** A Single-Page Application (SPA) architecture will be used to provide a fluid and responsive user experience, essential for the interactive, real-time nature of the simulation.
*   **Browser Support:** The application will support the latest stable versions of major evergreen browsers (Chrome, Firefox, Safari, Edge).
*   **Real-time Updates:** A critical requirement for the dashboard and Gantt chart to provide immediate feedback during the simulation.
*   **Accessibility:** The application will follow WCAG guidelines to ensure it is usable by people with disabilities, including support for keyboard navigation and screen readers.
*   **SEO:** Not a priority for this application, as it is a specialized tool accessed via login.

---

## User Experience Principles

The user experience will be clean, professional, and educational. The design will prioritize clarity and ease of understanding to make complex project management concepts accessible. The vibe should be that of a serious learning tool, guiding the user without being intimidating. The UI should reinforce the core value of learning by making the cause-and-effect relationships between actions and outcomes as clear as possible.

### Key Interactions

The three core interactions correspond to the main user workflow:
1.  **Setup:** A structured, form-based interface for defining projects and tasks, with clear input validation and feedback.
2.  **Simulation:** A largely observational phase where the user monitors the real-time progress on the dashboard and Gantt chart, with the ability to pause and inspect the current state.
3.  **Analysis:** An interactive dashboard where users can explore KPIs and drill down into the details. The AI feedback will be presented in a clear, conversational format.

---

## Functional Requirements

**Project Setup & Management**
*   FR1: Users can create, update, and delete projects.
*   FR2: For each project, users can define a Work Breakdown Structure (WBS) by creating tasks.
*   FR3: Users can define dependencies (predecessor-successor relationships) between tasks.
*   FR4: Users can set a budget and duration for each task.
*   FR5: Users can create and assign resources (labor, equipment) with specified capacities and costs.
*   FR6: Users can define potential risk events for the project, with a probability of occurrence and an impact on task cost and/or duration.
*   FR7: The system shall validate project setup to prevent logical errors (e.g., circular dependencies).

**Simulation**
*   FR8: The system shall calculate and display the critical path based on the project setup.
*   FR9: Users can start a simulation for a configured project.
*   FR10: During simulation, the system shall trigger risk events based on their defined probabilities.
*   FR11: Triggered risk events shall dynamically adjust the costs and durations of affected tasks.
*   FR12: The system shall provide a real-time, animated view of the project's progress on a Gantt chart during the simulation.
*   FR13: Users can pause, resume, and stop the simulation.

**Analysis & Reporting**
*   FR14: The system shall calculate and display Key Performance Indicators (KPIs) in real-time on a dashboard during the simulation, including Schedule Variance (SV), Cost Variance (CV), and a Risk Exposure Index (REI).
*   FR15: After a simulation, the system shall present a summary of the final project outcomes.
*   FR16: Users can view a log of all events that occurred during the simulation.

**AI Assistant**
*   FR17: After a simulation run, the AI assistant shall provide an analysis of the results.
*   FR18: The AI assistant's analysis shall include identification of key issues (e.g., major delays, cost overruns) and their causes.
*   FR19: The AI assistant shall provide actionable recommendations for improving the project plan in future simulations.

**User Account Management**
*   FR20: Users can register and log in to the application using email or Google OAuth.
*   FR21: Users can view and manage their saved projects.

---

## Non-Functional Requirements

### Performance

Performance is critical for a positive user experience and effective learning.
*   **Real-time Updates:** Gantt chart and KPI dashboard updates must appear visually instantaneous to the user (less than 1 second) after a simulation event.
*   **Simulation Speed:** While simulations run asynchronously, the total time for an average project simulation (e.g., 50 tasks) should be reasonable (e.g., under 30 seconds) to allow for quick iteration.
*   **Frontend Load Time:** The initial application load time should be under 3 seconds on a standard broadband connection.

### Security

Standard security practices will be implemented to protect user data.
*   **Authentication:** Secure authentication will be handled by Firebase Auth, with tokens verified on the backend for all API requests.
*   **Data Privacy:** User project data will be private to their account.
*   **Input Sanitization:** All user inputs will be sanitized to prevent injection attacks.

### Scalability

While the MVP is not designed for massive scale, the architecture should not preclude future growth.
*   **Asynchronous Processing:** The use of a task queue (Celery/RQ) for simulations allows the backend to handle multiple concurrent simulation requests without blocking.
*   **Stateless Backend:** The FastAPI backend will be stateless, allowing for horizontal scaling if needed.

### Accessibility

The application will be accessible to users with disabilities.
*   **WCAG Compliance:** The frontend will aim for WCAG 2.1 Level AA compliance.
*   **Keyboard Navigation:** All interactive elements will be navigable and operable via the keyboard.
*   **Screen Reader Support:** The application will use semantic HTML and ARIA attributes to ensure compatibility with screen readers.

---

_This PRD captures the essence of ibe160 - a tool to make complex project dynamics visible, measurable, and understandable._

_Created through collaborative discovery between BIP and AI facilitator._
