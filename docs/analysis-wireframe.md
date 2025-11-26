# Wireframe: Analysis Screen

This wireframe designs the "Analysis" screen, where users can review the outcomes of their simulation and receive AI-powered feedback.

## 1. Screen Layout & Overall Design

*   **Layout:** A three-section layout.
    *   **Top Section:** A summary of the final project KPIs.
    *   **Middle Section:** The AI Assistant's analysis and recommendations.
    *   **Bottom Section:** A detailed breakdown of the project results, possibly in tabs.
*   **Header:** The project name and a button to "Run New Simulation" which would take the user back to the "Project Setup" screen with the existing project loaded.

---

## 2. UI Components and Interactions

### Top Section: Final Performance Summary

*   **Component:** A series of prominent cards, one for each final KPI.
*   **KPI Cards:**
    *   **Final Cost:** Shows the final project cost and the variance from the budget.
    *   **Final Duration:** Shows the final project duration and the variance from the planned schedule.
    *   **Number of Risks Occurred:** A count of the risk events that were triggered during the simulation.
*   **Visuals:** Each card will have a clear icon and color-coding to indicate good or bad performance at a glance.

### Middle Section: AI Assistant Feedback

*   **Component:** A conversational UI or a structured report from the AI assistant.
*   **Content:**
    *   **Overall Assessment:** A summary of the project's performance (e.g., "The project was completed over budget and behind schedule.").
    *   **Key Issues:** A list of the main problems that occurred during the simulation, with explanations of their causes (e.g., "The delay in 'Task X' was the primary driver of the schedule slippage, caused by 'Risk Y'.").
    *   **Actionable Recommendations:** A list of specific, actionable suggestions for improving the project plan in the next simulation (e.g., "Consider adding more resources to 'Task X' to reduce its duration," or "Develop a mitigation plan for 'Risk Y'.").
*   **Interaction:** Each recommendation could be expandable to show more details or data to support the suggestion.

### Bottom Section: Detailed Results

*   **Component:** A tabbed interface to allow users to dive into the details.
*   **Tabs:**
    *   **Final Gantt Chart:** A static view of the final state of the Gantt chart, showing the actual start and end dates of all tasks.
    *   **Cost Breakdown:** A table or chart showing the cost breakdown by task, and where the major cost overruns occurred.
    *   **Risk Analysis:** A summary of all the risks that occurred, their impact, and how they affected the project.
    *   **Event Log:** The full event log from the simulation for detailed auditing.

---

## 3. User Flow

1.  The user is navigated to the "Analysis" screen after the simulation ends.
2.  The user can quickly see the high-level outcomes of the project in the summary section.
3.  The user reads the AI assistant's feedback to understand what went wrong and how to improve.
4.  The user can explore the detailed results in the tabbed section to get more context.
5.  Based on the analysis, the user can click "Run New Simulation" to go back to the "Project Setup" screen, apply the recommended changes, and try again.
