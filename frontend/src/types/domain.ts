export interface Project {
  id: number;
  name: string;
  description: string;
  budget: number;
  contingency: number; // Percentage
  start_date: string;
  end_date: string;
}

export interface Task {
  id: number;
  text: string;
  start_date: string;
  duration: number;
  progress: number;
  parent: number | null;
  dependencies: number[]; // Array of task IDs that must be completed before this task can start
  cost: number;
  resource_id?: number;
  project_id: number;
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

export interface CPMTaskDetail {
  id: number;
  es: number; // Earliest Start (in days from project start)
  ef: number; // Earliest Finish (in days from project start)
  ls: number; // Latest Start (in days from project start)
  lf: number; // Latest Finish (in days from project start)
  slack: number;
}

export interface SimulationRun {
  id: number;
  project_id: number;
  status: string;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  total_duration?: number | null;
  total_cost?: number | null;
  critical_path?: number[];
  results?: SimulationResults | null;
}

export interface SimulationResults {
  total_duration?: number;
  total_cost?: number;
  tasks_completed?: number;
  risk_events?: number;
  event_count?: number;
  base_duration?: number;
  critical_path?: number[];
  timeline?: { day: number; active: number; completed: number }[];
  base_cpm_task_details?: CPMTaskDetail[];
  p80_cost?: number; // optional future fields
  p80_duration?: number;
  base_cost?: number;
  mean_duration?: number;
  std_dev_duration?: number;
  p50_duration?: number;
  p90_duration?: number;
  mean_cost?: number;
  std_dev_cost?: number;
  p50_cost?: number;
  p90_cost?: number;
  iterations?: number;
  duration_distribution?: number[];
  bin_edges_duration?: number[];
  cost_distribution?: number[];
  bin_edges_cost?: number[];
  ai_assessment?: string;
  ai_recommendations?: string[];
  finalCost?: number;
  finalDuration?: number;
  risksOccurred?: number;
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
export type SimulationEventType =
  | 'TASK_START'
  | 'TASK_END'
  | 'RISK_EVENT'
  | 'SIM_START'
  | 'SIM_END'
  | 'task_started'
  | 'task_completed'
  | 'simulation_completed'
  | 'connected'
  | 'pong';

export interface SimulationEvent {
    timestamp: string | number;
    type?: SimulationEventType | string;
    event_type?: SimulationEventType | string;
    message?: string;
    task_id?: number;
    risk_id?: number;
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
