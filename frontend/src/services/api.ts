import { Project, Task, Resource, Risk } from '../types/domain';
import { ProjectCreate, TaskCreate, RiskCreate } from '../types/api';
import { mockResources } from '../data/seed';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export interface SimulationStatusResponse {
  status: 'running' | 'finished' | 'pending';
  progress: number;
  day: number;
}
// ... (rest of the interfaces remain the same)
export interface SimulationResults {
  finalCost: number;
  finalDuration: number;
  risksOccurred: number;
}

export interface AiInsights {
  overallAssessment: string;
  keyIssues: { id: string; text: string }[];
  actionableRecommendations: { id: string; text: string }[];
}

const API_LATENCY = 500; // ms

// --- Helper to simulate network delay ---
const withDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), API_LATENCY);
  });
};

// --- API Functions ---

/**
 * Fetches a list of all available projects.
 * Corresponds to: GET /projects
 */
export const getProjects = async (): Promise<Project[]> => {
  console.log('API: Fetching all projects...');
  const response = await fetch(`${API_BASE_URL}/projects/`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

/**
 * Creates a new project.
 * Corresponds to: POST /projects/
 */
export const createProject = async (projectData: ProjectCreate): Promise<Project> => {
  console.log('API: Creating new project...');
  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
};


/**
 * Fetches all details for a single project.
 * This function now makes real API calls for project and tasks,
 * but returns mock data for resources and risks.
 */
export const getProjectDetails = async (projectId: number): Promise<{ project: Project; tasks: Task[]; resources: Resource[]; risks: Risk[] }> => {
  console.log(`API: Fetching details for project ${projectId}...`);

  const projectPromise = fetch(`${API_BASE_URL}/projects/${projectId}`);
  const tasksPromise = fetch(`${API_BASE_URL}/projects/${projectId}/tasks/`);
  const risksPromise = fetch(`${API_BASE_URL}/projects/${projectId}/risks/`);

  const [projectResponse, tasksResponse, risksResponse] = await Promise.all([projectPromise, tasksPromise, risksPromise]);

  if (!projectResponse.ok) {
    throw new Error('Failed to fetch project details');
  }
  if (!tasksResponse.ok) {
    throw new Error('Failed to fetch tasks for the project');
  }
  if (!risksResponse.ok) {
    throw new Error('Failed to fetch risks for the project');
  }

  const project = await projectResponse.json();
  const tasks = await tasksResponse.json();
  const risks = await risksResponse.json();

  // Resources are still mocked
  return {
    project,
    tasks,
    resources: mockResources,
    risks,
  };
};

/**
 * Creates a new task for a project.
 * Corresponds to: POST /projects/{project_id}/tasks/
 */
export const createTask = async (projectId: number, taskData: TaskCreate): Promise<Task> => {
  console.log(`API: Creating new task for project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

/**
 * Updates an existing task.
 * Corresponds to: PATCH /tasks/{task_id}
 */
export const updateTask = async (taskId: number, taskData: Partial<TaskCreate>): Promise<Task> => {
  console.log(`API: Updating task ${taskId}...`);
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};

/**
 * Deletes a task.
 * Corresponds to: DELETE /tasks/{task_id}
 */
export const deleteTask = async (taskId: number): Promise<void> => {
  console.log(`API: Deleting task ${taskId}...`);
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

// --- Risk API Functions ---

/**
 * Creates a new risk for a project.
 * Corresponds to: POST /projects/{project_id}/risks/
 */
export const createRisk = async (projectId: number, riskData: RiskCreate): Promise<Risk> => {
  console.log(`API: Creating new risk for project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/risks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(riskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create risk');
  }
  return response.json();
};

/**
 * Updates an existing risk.
 * Corresponds to: PATCH /risks/{risk_id}
 */
export const updateRisk = async (riskId: number, riskData: Partial<RiskCreate>): Promise<Risk> => {
  console.log(`API: Updating risk ${riskId}...`);
  const response = await fetch(`${API_BASE_URL}/risks/${riskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(riskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update risk');
  }
  return response.json();
};

/**
 * Deletes a risk.
 * Corresponds to: DELETE /risks/{risk_id}
 */
export const deleteRisk = async (riskId: number): Promise<void> => {
  console.log(`API: Deleting risk ${riskId}...`);
  const response = await fetch(`${API_BASE_URL}/risks/${riskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete risk');
  }
};

export interface MonteCarloSimulationResult {
  base_duration: number;
  base_critical_path: number[];
  base_cost: number;
  iterations: number;
  mean_duration: number;
  std_dev_duration: number;
  p50_duration: number;
  p80_duration: number;
  p90_duration: number;
  duration_distribution: number[];
  bin_edges_duration: number[];
  mean_cost: number;
  std_dev_cost: number;
  p50_cost: number;
  p80_cost: number;
  p90_cost: number;
  cost_distribution: number[];
  bin_edges_cost: number[];
  ai_assessment: string;
  ai_recommendations: string[];
}

/**
 * Kicks off the simulation for a project in the background.
 * Corresponds to: POST /projects/{project_id}/simulate
 */
export const runSimulation = async (projectId: number): Promise<{ message: string }> => {
  console.log(`API: Kicking off simulation for project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to start simulation');
  }
  return response.json();
};

/**
 * Fetches the results of the latest simulation for a project.
 * Corresponds to: GET /projects/{project_id}/simulation_result
 */
export const getSimulationResult = async (projectId: number): Promise<MonteCarloSimulationResult> => {
  console.log(`API: Fetching simulation result for project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/simulation_result`);
  if (!response.ok) {
    throw new Error('Failed to fetch simulation result');
  }
  return response.json();
};


/**
 * Starts a new simulation run for a project.
 * In a real backend, this would kick off a background job (e.g., via Celery/Redis).
 * The backend would return a simulation run ID.
 * Corresponds to: POST /simulate
 */
export const startSimulation = (projectId: number): Promise<{ simulationId: string }> => {
    console.log(`API: Starting simulation for project ${projectId}...`);
    const simulationId = `sim-${Date.now()}`;
    // TODO: Connect to WebSocket/SSE endpoint for live updates using this simulationId
    console.log(`API: WebSocket/SSE connection would be established for ${simulationId}`);
    return withDelay({ simulationId });
};

/**
 * Fetches the current status of a simulation.
 * This would be used for polling if WebSockets are not available.
 * Corresponds to: GET /simulate/:id/status
 */
export const getSimulationStatus = (simulationId: string): Promise<SimulationStatusResponse> => {
    console.log(`API: Polling for status of simulation ${simulationId}...`);
    // This mock doesn't have a real running simulation, so it returns a static status.
    // A real backend would return current KPIs, progress, and logs.
    const status: SimulationStatusResponse = { status: 'running', progress: 0.5, day: 50 };
    return withDelay(status);
};

/**
 * Fetches the final results of a completed simulation.
 * Corresponds to: GET /simulate/:id/results
 */
export const getSimulationResults = (simulationId: string): Promise<SimulationResults> => {
    console.log(`API: Fetching results for simulation ${simulationId}...`);
    // Return a mock summary
    return withDelay({
        finalCost: 95000,
        finalDuration: 190,
        risksOccurred: 2,
        // ...plus final Gantt data, cost breakdowns, etc.
    });
};

/**
 * Fetches AI-generated insights for a completed simulation run.
 * Corresponds to: GET /ai/insights?simulationId=:id
 */
export const getAiInsights = (simulationId: string): Promise<AiInsights> => {
    console.log(`API: Fetching AI insights for simulation ${simulationId}...`);
    return withDelay({
        overallAssessment: "The project finished over budget and behind schedule due to significant delays from material shortages and weather events.",
        keyIssues: [
            { id: 'ki-1', text: "The 'Structural Steel' delivery delay had a cascading effect, pushing back the entire superstructure and envelope phases." },
            { id: 'ki-2', text: "Contingency budget was insufficient to cover the cost impact of the bad weather risk." },
        ],
        actionableRecommendations: [
            { id: 'ar-1', text: "For future projects, secure multiple quotes for critical materials to mitigate supplier risk." },
            { id: 'ar-2', text: "Increase contingency budget by 5% when project timelines fall within known adverse weather seasons." },
        ]
    });
}
