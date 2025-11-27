export interface Project {
  id: number;
  name: string;
  description: string;
  budget: number;
  contingency: number; // Percentage
}

export interface Task {
  id: number; // Unique ID for the task, now a number from backend
  text: string; // Name/description of the task
  start_date: string; // YYYY-MM-DD format
  duration: number; // in days
  progress: number; // 0 to 1
  parent: number | null; // ID of the parent task, now a number or null
  predecessors: number[]; // Array of task IDs this task depends on, now numbers
  cost: number;
  resource_id?: number; // Assuming resource IDs are numbers
  project_id: number; // Project ID foreign key
}

export interface Resource {
  id: number; // Assuming resource IDs are numbers
  name: string;
  cost_per_day: number;
}

export type RiskLikelihood = 'Low' | 'Medium' | 'High';
export type RiskImpact = 'Low' | 'Medium' | 'High';

export interface Risk {
  id: number; // Assuming risk IDs are numbers
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  // Probability is derived from likelihood, e.g., Low=0.1, Medium=0.3, High=0.6
  probability: number; 
  // Cost impact is derived from impact level, e.g., Low=5000, Medium=20000, High=50000
  cost_impact: number;
  // Duration impact in days
  duration_impact: number; 
  affected_task_ids: number[]; // Now numbers
}

// Data structure for the Gantt chart
export interface GanttTask {
    id: number;
    start_date: string;
    text: string;
    duration: number;
    progress: number;
    parent?: number | null; // Now number or null
    cost?: number;
    // DHTMLX Gantt specific fields
    type?: string; 
    open?: boolean;
}

export interface GanttLink {
    id: number;
    source: number;
    target: number;
    type: string; // e.g., '0' for finish_to_start
}

// For simulation logs
export type SimulationEventType = 'TASK_START' | 'TASK_END' | 'RISK_EVENT' | 'SIM_START' | 'SIM_END';

export interface SimulationEvent {
    timestamp: number; // Unix timestamp or simulation day
    type: SimulationEventType;
    message: string;
    details?: Record<string, unknown>;
}

// For KPIs
export interface KpiValues {
    pv: number; // Planned Value
    ev: number; // Earned Value
    ac: number; // Actual Cost
    sv: number; // Schedule Variance (EV - PV)
    cv: number; // Cost Variance (EV - AC)
    rei: number; // Risk Exposure Index
}
