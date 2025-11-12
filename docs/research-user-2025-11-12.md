### **User Research Report: Understanding Key Project Personas**

**Date:** 2025-11-12
**Project:** ibe160
**Research Mode:** User Research
**Author:** BMad Business Analyst (Mary)

---

### **Executive Summary**

This User Research Report provides a deep dive into the perspectives of key operational and strategic roles within a project environment: the Planner, Site Lead, PMO Analyst, and Instructor. Through simulated interviews, we identified critical pain points, decision-making processes, and, crucially, their tolerance and apprehension regarding automation. The findings highlight a strong desire for automation to handle tedious data collection and aggregation, but a firm insistence on human oversight for decisions involving nuanced judgment, resource allocation, and core project logic. This report includes a comparative user journey map, a prioritized list of Jobs-to-be-Done, and a set of "No-Go" Automation Rules to guide future system development.

---

### **1. User Journey Map: Weekly Progress Update & Reporting Cycle**

This map illustrates a simplified "Weekly Progress Update & Reporting Cycle" from the perspective of the three core operational personas.

**Journey Stage: Weekly Progress Update & Reporting**

| **Phase** | **Planner (David)** | **Site Lead (Maria)** | **PMO (Sarah)** |
| :--- | :--- | :--- | :--- |
| **1. Preparation** | **Task:** Prepares schedule for update. Identifies tasks needing progress. <br> **Feeling:** 🤔 Anxious. "Will I get the data on time?" | **Task:** Reviews the week's work. Gathers notes on progress and issues. <br> **Feeling:** 😫 Annoyed. "Time to do the paperwork." | **Task:** Reviews calendar for upcoming steering committee. <br> **Feeling:** 😐 Neutral. "Hope the data is clean this week." |
| **2. Data Collection** | **Task:** Chases Site Leads for progress reports via email/phone. <br> **Feeling:** 😤 Frustrated. "Why is this so manual?" | **Task:** Fills out daily reports or a weekly summary spreadsheet. <br> **Feeling:** 😩 Tedious. "This takes forever." | **Task:** Waits for project status reports to be submitted. <br> **Feeling:** ⏳ Impatient. "Half the reports are late again." |
| **3. Processing** | **Task:** Manually enters data into P6. Runs the schedule update. <br> **Feeling:** 🧐 Focused. "Let's see what the damage is." | **Task:** Translates the master schedule into a practical 2-week look-ahead. <br> **Feeling:** 🤔 Engaged. "How do I make this work on the ground?" | **Task:** Manually consolidates data from different reports into a portfolio dashboard. <br> **Feeling:** 🤯 Overwhelmed. "The numbers don't match!" |
| **4. Analysis** | **Task:** Analyzes the new critical path and float erosion. Identifies new risks. <br> **Feeling:** 🤓 Analytical. "Okay, the delay here is the new priority." | **Task:** Compares the plan to site reality. Identifies immediate blockers (materials, access). <br> **Feeling:** 🧐 Problem-solving. "We can't do that, but we can do this instead." | **Task:** Analyzes portfolio-level KPIs (CPI, SPI). Identifies red/yellow projects. <br> **Feeling:** 🤨 Concerned. "Project Alpha is trending down again." |
| **5. Reporting** | **Task:** Creates and distributes the updated schedule and a summary report. <br> **Feeling:** ✅ Accomplished. "The report is out. Now for the questions." | **Task:** Communicates the 2-week look-ahead to foremen and subcontractors. <br> **Feeling:** 🗣️ Directive. "Here's the plan for the next two weeks." | **Task:** Prepares and presents the portfolio health report to senior leadership. <br> **Feeling:** 😬 Stressed. "I need to be able to defend these numbers." |

---

### **2. Top 10 Jobs-to-be-Done (JTBD)**

This prioritized list consolidates the core needs and goals across all interviewed personas, framed from their perspective.

1.  **"Help me see what's most important right now"** - All users need to quickly identify the most critical risks, tasks, or projects that require their immediate attention.
2.  **"Reduce my manual data entry and report consolidation"** - A universal and significant pain point. Users want to spend less time copying/pasting and more time analyzing.
3.  **"Tell me the 'why' behind the data"** - Users are skeptical of "black box" automation. They need to understand the logic behind a change or suggestion to trust it.
4.  **"Give me a reliable forward-looking view"** - Users want to move from reactive problem-solving to proactive planning by seeing future resource bottlenecks or schedule risks.
5.  **"Let me trust the data"** - Users need confidence that the data is accurate, up-to-date, and consistent across different reports and systems.
6.  **"Bridge the gap between the plan and reality"** - Users need tools that acknowledge and incorporate real-world context (like site conditions or individual skills) that isn't in the formal plan.
7.  **"Automate my tedious communication"** - Users want to automate repetitive communication tasks like chasing for updates or distributing standard reports.
8.  **"Let me make the final call on important changes"** - Users want automation to *suggest* and *assist*, but they must retain control over key decisions (resource allocation, logic changes).
9.  **"Give me easy access to the information I need, where I need it"** - Whether it's a drawing on-site or a KPI on a dashboard, users need frictionless access to relevant data in their context.
10. **"Help me teach or explain complex concepts clearly"** - (Primarily for the Instructor, but also relevant for PMs/Planners) Users need tools to make complex processes transparent and understandable.

---

### **3. "No-Go" Automation Rules**

This set of clear rules defines the boundaries of acceptable automation, based on the strong consensus from the interviews, to ensure trust and effective human-AI collaboration.

1.  **Rule: Do Not Automate Final Resource Allocation.**
    *   **Rationale:** The system lacks the human context of individual skills, team dynamics, and site-specific conditions. A person must make the final decision on who does the work.
    *   **Acceptable Alternative:** The system can *suggest* resource optimizations or flag over-allocations, but it must not automatically move resources.

2.  **Rule: Do Not Automate Changes to Core Schedule Logic.**
    *   **Rationale:** The relationships between tasks (predecessors, successors) represent the fundamental construction or execution strategy. An automated change could have unforeseen and disastrous consequences.
    *   **Acceptable Alternative:** The system can identify logic flaws (e.g., open ends) or suggest links for new tasks, but a Planner must approve and implement any change to the logic.

3.  **Rule: Do Not Make Strategic Decisions.**
    *   **Rationale:** Decisions about project prioritization, budget reallocation, or accepting major risks require strategic context and human judgment that the system does not have.
    *   **Acceptable Alternative:** The system can provide data, run scenarios, and present analyses to *support* strategic decision-making, but it cannot make the decision itself.

4.  **Rule: Do Not Operate as a "Black Box".**
    *   **Rationale:** If a user cannot explain *why* the system did something, they cannot defend it, and therefore cannot trust it. All automated actions or suggestions must be accompanied by a clear, auditable explanation of the logic used.
    *   **Acceptable Alternative:** An "explainable AI" approach where every suggestion comes with a "Why am I seeing this?" link that details the inputs and rules that led to the recommendation.