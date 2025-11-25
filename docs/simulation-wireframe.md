# Wireframe: Simulation Screen

This wireframe details the UI for the real-time "Simulation" screen.

## 1. Screen Layout & Overall Design

*   **Layout:** A two-panel layout will be used.
    *   **Top Panel (70% height):** The main visualization area containing the Gantt chart.
    *   **Bottom Panel (30% height):** A tabbed area for the KPI dashboard and event log.
*   **Header:** A header will display the project name and simulation controls (Play, Pause, Stop).

---

## 2. UI Components and Interactions

### Header: Simulation Controls

*   **Component:** A control bar with buttons for:
    *   **Play/Pause:** Toggles the simulation's execution.
    *   **Stop:** Ends the simulation and takes the user to the "Analysis" screen.
    *   **Simulation Speed:** A slider to control the speed of the animation (e.g., 1x, 2x, 4x).

### Top Panel: Real-time Gantt Chart

*   **Component:** A dynamic Gantt chart (e.g., using DHTMLX Gantt).
*   **Visualization:**
    *   **Task Bars:** Will show the progress of each task. The completed portion of the task will be filled in.
    *   **Critical Path:** The critical path will be highlighted in a distinct color (e.g., red).
    *   **Real-time Updates:** The chart will update in real-time to reflect the simulation's progress, with smooth animations.
    *   **Risk Events:** When a risk event occurs, a visual indicator (e.g., an icon) will appear on the affected task bar. Hovering over the indicator will show a tooltip with details about the risk.

### Bottom Panel: Dashboard and Logs

*   **Component:** A tabbed panel.
*   **Tabs:**
    *   **KPI Dashboard:**
        *   **Component:** A set of cards or gauges displaying the key performance indicators (KPIs).
        *   **KPIs:**
            *   **Schedule Variance (SV):** Displayed with a color code (e.g., green for positive, red for negative).
            *   **Cost Variance (CV):** Displayed with a color code.
            *   **Risk Exposure Index (REI):** A gauge or progress bar showing the current risk level.
        *   **Charts:** Small trend line charts next to each KPI to show its evolution over time.
    *   **Event Log:**
        *   **Component:** A scrollable log of all events that have occurred during the simulation.
        *   **Log Entries:** Each entry will have a timestamp and a description (e.g., "Task 'Pour Foundation' started", "Risk 'Heavy Rain' occurred, delaying 'Exterior Painting' by 2 days").

---

## 3. User Flow

1.  After the user clicks "Start Simulation" on the "Project Setup" screen, they are taken to the "Simulation" screen.
2.  The simulation begins automatically, and the Gantt chart and KPI dashboard update in real-time.
3.  The user can use the controls in the header to pause, resume, or change the speed of the simulation.
4.  The user can monitor the project's health through the KPIs and the event log.
5.  When the simulation is complete or the user clicks "Stop", they are navigated to the "Analysis" screen to review the final results and the AI's feedback.
