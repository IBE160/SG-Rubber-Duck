# Wireframe: Project Setup Screen (v2)

This wireframe provides a detailed design for the "Project Setup" screen, incorporating insights from the project documentation.

## 1. Screen Layout & Overall Design

*   **Layout:** A three-panel layout will be used to provide a clear and organized workspace.
    *   **Left Panel (30% width):** Project List and Details.
    *   **Center Panel (50% width):** Work Breakdown Structure (WBS) Tree.
    *   **Right Panel (20% width):** Contextual Details for selected WBS item (Budget, Risks, etc.).
*   **Header:** A main header will contain the application title and user profile information.
*   **Footer:** A footer will contain a "Start Simulation" button, which will be the primary call to action.

---

## 2. UI Components and Interactions

### Left Panel: Project List

*   **Component:** A list of the user's saved projects.
*   **Actions:**
    *   "New Project" button to create a new project.
    *   Each project in the list will have "Edit" and "Delete" buttons.
    *   Selecting a project will load its details into the center and right panels.

### Center Panel: Work Breakdown Structure (WBS)

*   **Component:** An interactive tree table to represent the WBS.
*   **Columns:** "Task Name", "Duration", "Start Date", "End Date", "Predecessors".
*   **Interactions:**
    *   **In-place Editing:** Users can click on a cell to edit its value directly (e.g., change a task name or duration).
    *   **Hierarchical Structure:** Users can indent/outdent tasks to create the WBS hierarchy.
    *   **Dependencies:** The "Predecessors" column will allow users to define task dependencies by referencing other task IDs. A popover or modal could assist in selecting predecessors.
    *   **Context Menu:** A right-click context menu on a task will provide options like "Add Sub-task", "Delete Task", "Add Dependency", etc.
*   **Primary Action:** An "Add Task" button at the top of the panel.

### Right Panel: Contextual Details

*   **Component:** A tabbed panel that displays details for the selected task in the WBS.
*   **Tabs:**
    *   **Budget:**
        *   **Fields:** "Task Cost", "Contingency".
        *   **Display:** Shows the calculated total cost for the task.
    *   **Risks:**
        *   **Component:** A list of risks associated with the selected task.
        *   **Actions:** "Add Risk" button, which opens a form/modal to define a new risk.
        *   **Risk Form Fields:** "Risk Description", "Probability" (slider or dropdown: Low, Medium, High), "Impact" (slider or dropdown: Low, Medium, High), "Impact on" (Cost or Duration).
    *   **Resources:**
        *   **Component:** A list of resources assigned to the task.
        *   **Actions:** "Assign Resource" button.
        *   **Resource Form Fields:** "Resource Name", "Cost per hour".

### Footer: Main Action

*   **Component:** A prominent "Start Simulation" button.
*   **State:** The button will be disabled until the project setup is valid (e.g., all tasks have durations, no circular dependencies). A tooltip will explain why the button is disabled if the user hovers over it.

---

## 3. User Flow

1.  The user selects a project from the list or creates a new one.
2.  The user builds the WBS in the center panel, adding tasks and defining their hierarchy and dependencies.
3.  As the user selects a task, the right panel updates to show its contextual details.
4.  The user adds budget information, risks, and resources for each task using the right panel.
5.  The system provides real-time validation feedback (e.g., highlighting circular dependencies in the WBS).
6.  Once the project setup is valid, the "Start Simulation" button is enabled.
7.  The user clicks "Start Simulation" to proceed to the simulation view.
