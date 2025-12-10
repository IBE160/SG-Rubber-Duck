export interface ProjectCreate {
  name: string;
  description: string;
  budget: number;
  start_date: string;
  end_date: string;
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  contingency?: number;
}

export interface TaskCreate {
  text: string;
  start_date: string;
  duration: number;
  progress?: number;
  parent?: number | null;
  cost?: number;
  dependencies?: number[]; // Use dependencies
  resource_id?: number;
}

export interface TaskUpdate extends Partial<TaskCreate> {}

export interface RiskCreate {
  description: string;
  likelihood?: 'Low' | 'Medium' | 'High';
  impact?: 'Low' | 'Medium' | 'High';
  probability?: number;
  cost_impact?: number;
  duration_impact?: number;
  affected_task_ids: number[];
}

export interface RiskUpdate extends Partial<RiskCreate> {}
