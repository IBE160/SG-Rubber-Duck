# ibe160 - Product Requirements Document

**Author:** BIP
**Date:** onsdag 26. november 2025
**Version:** 1.0

---

## Executive Summary

This AI-Driven Construction Project Management Simulator aims to bridge the gap between theoretical knowledge and practical application for students and professionals in the construction industry. By leveraging modern algorithms and AI, it provides an interactive, visually-rich environment for simulating project planning, execution, scheduling, resource allocation, and risk management. The core vision is to offer immediate, quantitative, and visual feedback, allowing users to develop intuitive understanding and decision-making skills in a dynamic, risk-free setting. This simulation platform will be known for its ease of use, intuitive interface, modern design, and highly accurate simulation, establishing itself as the premier tool for learning and practicing project management.

### What Makes This Special

The product's core differentiator lies in its unparalleled ease of use, intuitive interface, and modern design, combined with a highly accurate and immersive simulation engine. It aims to be the leading tool for practical project management learning by providing a superior and realistic experience that surpasses traditional methods.

---

## Project Classification

**Technical Type:** web_app
**Domain:** edtech
**Complexity:** medium

The project is a greenfield software development project, classified as a web application, targeting the educational technology (EdTech) domain. Its primary function is to serve as a simulation platform for project management.





---

## Success Criteria

The success of this project is defined by its ability to deliver a seamless and educational user experience. Key success criteria include:
- **Educational Impact:** Users demonstrate a clear improvement in their understanding of project management principles, as measured by their ability to manage simulated projects to successful completion.
- **User Engagement:** High user engagement and retention, indicated by users completing multiple simulations and exploring various scenarios.
- **Intuitive User Experience:** Users can navigate the platform and its features with minimal friction, finding the simulation easy to set up and run.
- **Simulation Accuracy:** The simulation accurately reflects the dynamics of real-world construction projects, providing credible and valuable learning experiences.
- **Positive Feedback:** The platform receives positive feedback from students and instructors for its effectiveness as a teaching and learning tool.



---

## Product Scope

### MVP - Minimum Viable Product

The MVP is focused on delivering a complete, end-to-end simulation experience. It includes:
- **Project Setup:** Users can define a Work Breakdown Structure (WBS), task dependencies, budget, duration, and resources. Basic risk factors (probability and impact) can also be defined.
- **Deterministic Simulation:** A baseline schedule is generated using the Critical Path Method (CPM). The simulation runs based on this deterministic model.
- **Dynamic Risk Events:** During the simulation, pre-defined risk events can occur, dynamically adjusting task durations and costs.
- **Real-time Visualization:** A Gantt chart and a performance dashboard update in real-time to reflect the project's status as the simulation progresses.
- **Core Analytics:** The platform will calculate and display key performance indicators (KPIs) such as Schedule Variance (SV) and Cost Variance (CV).
- **Basic AI Feedback:** An integrated AI component will provide high-level contextual feedback on the simulation results.

### Growth Features (Post-MVP)

Following the MVP, the platform will be enhanced with features to deepen the learning experience and expand its utility:
- **Advanced Resource Management:** Introduce resource leveling, skill-based assignments, and resource constraints to create more realistic scenarios.
- **Deeper AI Analysis:** The AI will provide more sophisticated analysis, including root cause analysis of delays and predictive modeling of project outcomes.
- **Collaborative Mode:** Allow multiple users to collaborate on the same project simulation, with different roles and responsibilities (e.g., Project Manager, Site Lead).
- **Scenario Library:** A library of pre-built project scenarios and templates for various construction project types (e.g., residential, commercial, infrastructure).
- **Instructor Dashboard:** A dedicated dashboard for instructors to create, manage, and monitor student simulations, and to evaluate their performance.

### Vision (Future)

The long-term vision is to create a comprehensive and intelligent "digital twin" for construction project management education and training:
- **Full Project Lifecycle Simulation:** Extend the simulation to cover the entire project lifecycle, from bidding and procurement to project close-out and handover.
- **Generative AI for Scenario Creation:** Users can describe a project in natural language, and the AI will generate a complete simulation scenario, including WBS, resources, and risks.
- **Integration with BIM and other industry tools:** Allow users to import project data from Building Information Modeling (BIM) software and other industry-standard tools.
- **Personalized Learning Paths:** The AI will adapt the simulation difficulty and challenges based on the user's performance and learning goals, creating a personalized learning path.
- **Certification and Badging:** Offer official certifications and digital badges for users who demonstrate mastery of project management skills within the simulation environment.

---



---



---



---



---

<h2>Functional Requirements</h2>

**User Account & Access**
FR1: Users can create an account using email and password.
FR2: Users can log in and out of the application.
FR3: The system supports user authentication via Google OAuth.

**Project Management**
FR4: Users can create a new project, providing a name and description.
FR5: Users can view a list of all their projects.
FR6: Users can delete a project.
FR7: Users can define a Work Breakdown Structure (WBS) for a project, consisting of tasks and sub-tasks.
FR8: Users can define dependencies between tasks (finish-to-start).
FR9: Users can assign a duration and a budget to each task.
FR10: Users can define a list of available resources for a project.
FR11: Users can assign resources to tasks.
FR12: The system can calculate the critical path for a project based on the WBS and dependencies.

**Simulation**
FR13: Users can start a simulation for a project.
FR14: Users can pause and resume a simulation.
FR15: During the simulation, the system will update the project status in real-time.
FR16: Users can define risk events with a probability and an impact (cost and/or duration).
FR17: The system will randomly trigger risk events during the simulation based on their probability.

**Visualization & Reporting**
FR18: The system will display the project schedule as a Gantt chart.
FR19: The Gantt chart will update in real-time during the simulation.
FR20: The system will display a dashboard with key performance indicators (KPIs).
FR21: The dashboard will show the Schedule Variance (SV) and Cost Variance (CV) in real-time.
FR22: The system will provide AI-generated contextual feedback on the simulation results.

---

<h2>Non-Functional Requirements</h2>







---

_This PRD captures the essence of ibe160 - This product provides significant value by offering a hands-on, interactive learning experience that is more effective and engaging than traditional methods. It empowers students and professionals to develop practical project management skills in a risk-free environment, ultimately preparing them for real-world challenges._

_Created through collaborative discovery between BIP and AI facilitator._
