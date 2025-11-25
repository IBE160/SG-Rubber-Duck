t # High-Fidelity Mockups

This document provides a detailed description of the high-fidelity mockups for the key screens of the AI-Driven Construction Project Management Simulator. These descriptions are based on the wireframes and the visual design guidelines.

## 1. Project Setup Screen

This screen will have a clean, professional, and modern look and feel, with a clear visual hierarchy.

### Header

*   **Component:** A Material-UI `AppBar`.
*   **Color:** `primary.main` (`#1976D2`).
*   **Content:**
    *   **Left:** The application title, "AI-Driven Construction Project Management Simulator", in `h6` style with white text.
    *   **Right:** A user avatar and name, with a dropdown menu for "Profile" and "Logout".

### Left Panel: Project List

*   **Component:** A Material-UI `Card` with `Paper` background (`#F5F5F5`).
*   **Header:** A `CardHeader` with the title "Projects".
*   **Content:**
    *   **New Project Button:** A Material-UI `Button` with `variant="contained"` and `color="primary"`.
    *   **Project List:** A Material-UI `List` of projects. Each `ListItem` will show the project name and have "Edit" and "Delete" `IconButton`s. The selected project will have a `primary.light` (`#42A5F5`) background.

### Center Panel: Work Breakdown Structure (WBS)

*   **Component:** A Material-UI `Paper` component with a white background (`#FFFFFF`).
*   **Header:** An "Add Task" `Button` with `variant="outlined"` and `color="primary"`.
*   **Table:** A tree table with a clean and spacious design.
    *   **Header:** The table header will have a light gray background.
    *   **Rows:** Rows will have alternating colors (`#FFFFFF` and `#F5F5F5`) for better readability.
    *   **Text:** Cell text will be `body2` style (`14px`). Task names in the first column will be `body1` (`16px`).
    *   **Dependencies:** The "Predecessors" column will show task IDs as chips (Material-UI `Chip` component) for a clear visual representation.

### Right Panel: Contextual Details

*   **Component:** A Material-UI `Paper` with a white background.
*   **Tabs:** Material-UI `Tabs` with the `primary.main` color for the indicator.
    *   **Budget Tab:** Will contain Material-UI `TextField` components for "Task Cost" and "Contingency".
    *   **Risks Tab:** Will have an "Add Risk" `Button` and a `List` of risks. Each risk `ListItem` will show the description and have chips for "Likelihood" and "Impact" with colors corresponding to the level (e.g., green for Low, yellow for Medium, red for High).
    *   **Resources Tab:** Similar to the Risks tab, with a list of assigned resources.

### Footer

*   **Component:** A Material-UI `AppBar` with `position="fixed"` at the bottom.
*   **Color:** `primary.dark` (`#1565C0`).
*   **Content:** A large, prominent "Start Simulation" `Button` with `variant="contained"` and `color="secondary"` (`#FFC107`). The button will have a disabled state with a gray background when the project setup is invalid.

## 2. Simulation Screen

This screen is designed to be a "mission control" center for the user, providing a clear and engaging view of the simulation as it unfolds.

### Header

*   **Component:** A Material-UI `AppBar`.
*   **Color:** `primary.main` (`#1976D2`).
*   **Content:**
    *   **Left:** The project name in `h6` style with white text.
    *   **Center:** Simulation controls:
        *   `IconButton`s for "Play" and "Pause" with their respective icons.
        *   An `IconButton` for "Stop" with a stop icon.
        *   A `Slider` for controlling the simulation speed, with marks for 1x, 2x, and 4x.
    *   **Right:** A "Go to Analysis" `Button` with `variant="outlined"` and `color="inherit"` (white). This button will be disabled until the simulation is stopped.

### Top Panel: Real-time Gantt Chart

*   **Component:** A dynamic Gantt chart, which will be the main focus of the screen.
*   **Visuals:**
    *   **Task Bars:** The task bars will use the `primary.light` (`#42A5F5`) color. The progress within each task will be shown in `primary.main` (`#1976D2`).
    *   **Critical Path:** Tasks on the critical path will have a red border or a red-tinted background to make them stand out.
    *   **Risk Events:** When a risk occurs, a `warning` icon (amber color) will appear next to the affected task. A tooltip on hover will provide details.

### Bottom Panel: Dashboard and Logs

*   **Component:** A Material-UI `Paper` with tabs.
*   **Tabs:**
    *   **KPI Dashboard:**
        *   **Component:** A grid of Material-UI `Card`s. Each card will have a `CardHeader` with the KPI title and a `CardContent` with the value.
        *   **KPI Cards:**
            *   **Schedule Variance (SV):** The value will be colored `success.main` (`#388E3C`) for positive values and `error.main` (`#D32F2F`) for negative values. A small line chart will show the trend.
            *   **Cost Variance (CV):** Same styling as the SV card.
            *   **Risk Exposure Index (REI):** A `CircularProgress` bar (or a linear one) will be used to show the REI, with the color changing from green to yellow to red as the risk increases.
    *   **Event Log:**
        *   **Component:** A virtualized list to efficiently display a large number of log entries.
        *   **Log Entries:** Each entry will be a `ListItem` with a timestamp and a descriptive message. Icons will be used to differentiate event types (e.g., a "play" icon for a task start, a "warning" icon for a risk event).

## 3. Analysis Screen

This screen is designed to be a clear and insightful summary of the simulation results, guiding the user towards better future planning.

### Header

*   **Component:** A Material-UI `AppBar`.
*   **Color:** `primary.main` (`#1976D2`).
*   **Content:**
    *   **Left:** The project name in `h6` style with white text.
    *   **Right:** A "Run New Simulation" `Button` with `variant="outlined"` and `color="inherit"` (white).

### Top Section: Final Performance Summary

*   **Component:** A grid of Material-UI `Card`s with a `Paper` background (`#F5F5F5`).
*   **KPI Cards:**
    *   **Final Cost:** A card with the title "Final Cost", displaying the total cost in a large font (`h4` style). Below it, the variance from the budget will be shown in a smaller font, colored `error.main` (`#D32F2F`) for overruns and `success.main` (`#388E3C`) for savings.
    *   **Final Duration:** Similar to the Final Cost card, showing the total duration and schedule variance.
    *   **Risks Occurred:** A card showing the total number of risks that occurred during the simulation.

### Middle Section: AI Assistant Feedback

*   **Component:** A Material-UI `Card` with a `CardHeader` titled "AI Assistant Analysis".
*   **Content:**
    *   **Overall Assessment:** A short summary of the project's performance in `body1` text.
    *   **Key Issues:** A list of bullet points, each describing a key issue. The text will be `body2`.
    *   **Actionable Recommendations:** A list of recommendations. Each recommendation will be a `ListItem` with an icon (e.g., a lightbulb). The text will be `body1` to give it more prominence.

### Bottom Section: Detailed Results

*   **Component:** A Material-UI `Paper` with tabs.
*   **Tabs:**
    *   **Final Gantt Chart:** A static, non-interactive view of the final Gantt chart.
    *   **Cost Breakdown:** A table (Material-UI `Table`) showing the budgeted vs. actual cost for each task. Over-budget tasks will be highlighted in red.
    *   **Risk Analysis:** A table listing all the risks that occurred, their impact on cost and duration, and the total impact of each risk.
    *   **Event Log:** The same event log component from the simulation screen, showing the full history of the simulation.
