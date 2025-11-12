# Product Brief: ibe160

**Date:** 2025-11-12
**Author:** BIP
**Context:** educational/startup

---

## Executive Summary

Construction projects are inherently complex, requiring a balance between time, cost, resources, and risk. Students and early-career project managers often learn these concepts theoretically, but lack the opportunity to experience how small planning decisions affect overall project performance in practice. This project proposes an interactive, AI-enhanced web platform that allows users to design, execute, and analyze simulated construction projects. The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment. The end goal is to enable users to develop intuition for project planning, scheduling, and risk management through interactive experimentation rather than static instruction.

---

## Initial Vision

An interactive, AI-enhanced web platform that allows users to design, execute, and analyze simulated construction projects. The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment, enabling users to develop intuition for project planning, scheduling, and risk management through interactive experimentation.

---

## Core Vision

### Problem Statement

Students and early-career project managers struggle with the theoretical nature of project management education, particularly the complexity of methods, mathematical aspects, and forecasting. This lack of practical experience hinders their ability to adapt to diverse project situations, as experience is crucial for effective learning and application. Theory alone is insufficient; experience is key to truly understanding and applying project management principles.

{{#if problem_impact}}

### Problem Impact

{{problem_impact}}
{{/if}}

### Why Existing Solutions Fall Short

There is a significant lack of dedicated interactive tools or simulations specifically designed for students to gain practical experience in project management. While professional project management tools exist, they are not tailored to the learning needs of students and early-career professionals, focusing instead on execution rather than experiential learning.

### Proposed Solution

This project proposes an interactive, AI-enhanced web platform that allows users to design, execute, and analyze simulated construction projects. The simulator combines classical project management algorithms—such as the Critical Path Method (CPM)—with modern AI-powered analysis to create a dynamic learning and decision-making environment.

### Key Differentiators

The platform's key differentiators lie in its interactive, experiential learning approach, moving beyond static instruction. It uniquely combines classical project management algorithms (like CPM) with modern AI-powered analysis to create a dynamic and adaptive learning environment. This enables users to develop intuition for project planning, scheduling, and risk management through direct experimentation and real-time feedback.

---

## Target Users

### Primary Users

The primary users are students and early-career project managers who are learning about construction project management. They currently attempt to simulate projects from scratch, requiring familiarity with all methods, which is time-consuming and often leads to frustration due to complexity, lack of proper functioning, or difficulty without clear learning guidance. They are individuals who understand project management concepts theoretically but lack practical experience in applying these concepts and understanding the real-world impact of their decisions.

### Secondary Users

Beyond students and early-career professionals, individuals already working on projects could benefit from the learning courses and interactive simulations to refresh their knowledge, learn new methods, or gain deeper intuition for specific project management challenges. This includes experienced project managers looking for continuous professional development.

### User Journey

Users will engage with an interactive application that guides them through the different parts of a simulated construction project. This journey will be supported by a tutorial system, providing step-by-step instructions and explanations, allowing users to learn by doing and immediately see the impact of their decisions within the simulation. This guided experience aims to alleviate frustrations related to complexity and lack of clear learning paths in current methods.

---

## Success Metrics

The primary measure of success for this platform will be its functionality and user adoption. Success will be evident if the application works reliably and effectively. A key indicator of pride and achievement will be if students actively choose to use this platform as their preferred method for learning project management.

### Key Performance Indicators

Measurable indicators of success will include:
- **Student Usage:** The number of students actively using the platform.
- **Academic Performance:** An increase in student grades related to project management courses, suggesting improved understanding and application of concepts.

---

## MVP Scope

### Core Features

The MVP must enable users to successfully complete the full *Setup → Simulate → Analyze* workflow for a construction project. This includes:
- **Project Setup:** Defining project parameters, tasks, resources, and dependencies.
- **Simulation Engine:** Running simulations based on defined project parameters and algorithms (e.g., Critical Path Method).
- **Interactive Analysis:** Providing real-time feedback through dynamic Gantt charts and KPI dashboards that update within one second of event changes.

{{#if out_of_scope}}

### Out of Scope for MVP

{{out_of_scope}}
{{/if}}

### MVP Success Criteria

The MVP will be considered successful if:
- Key Performance Indicators (KPIs) are computed accurately and consistently match expected textbook results for simulated scenarios.
- Gantt charts and KPI dashboards provide real-time updates, reflecting event changes within one second, ensuring a dynamic and responsive user experience.

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

## Technical Preferences

The application will employ a modular full-stack design with the following technologies:

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

{{#if organizational_context}}

## Organizational Context

{{organizational_context}}
{{/if}}

{{#if risks_and_assumptions}}

## Risks and Assumptions

{{risks_and_assumptions}}
{{/if}}

## Timeline

The first version of the platform needs to be completed by December 5th.

{{#if supporting_materials}}

## Supporting Materials

{{supporting_materials}}
{{/if}}

---

_This Product Brief captures the vision and requirements for ibe160._

_It was created through collaborative discovery and reflects the unique needs of this {{context_type}} project._

{{#if next_workflow}}
_Next: {{next_workflow}} will transform this brief into detailed planning artifacts._
{{else}}
_Next: Use the PRD workflow to create detailed product requirements from this brief._
{{/if}}
