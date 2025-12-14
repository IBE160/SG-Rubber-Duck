import { Project, Task, Resource, Risk, SimulationRun, SimulationResults } from '../types/domain';
import { ProjectCreate, ProjectUpdate, TaskCreate, RiskCreate } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

export interface SimulationStatusResponse extends SimulationRun {}

export interface SimulationEvent {
  event_type: string;
  timestamp: string;
  task_id?: number;
  risk_id?: number;
  details?: Record<string, unknown>;
}

export interface AiInsights {
  overallAssessment: string;
  keyIssues: { id: string; text: string }[];
  actionableRecommendations: { id: string; text: string }[];
}

const API_LATENCY = 500; // ms

// --- Helper to simulate network delay ---
const withDelay = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), API_LATENCY));

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
 * Deletes a project.
 * Corresponds to: DELETE /projects/{project_id}
 */
export const deleteProject = async (projectId: number): Promise<void> => {
  console.log(`API: Deleting project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
};

/**
 * Updates an existing project.
 * Corresponds to: PATCH /projects/{project_id}
 */
export const updateProject = async (projectId: number, data: ProjectUpdate): Promise<Project> => {
  console.log(`API: Updating project ${projectId}...`);
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
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
  const resourcesPromise = fetch(`${API_BASE_URL}/projects/${projectId}/resources/`);

  const [projectResponse, tasksResponse, risksResponse, resourcesResponse] = await Promise.all([projectPromise, tasksPromise, risksPromise, resourcesPromise]);

  if (!projectResponse.ok) {
    throw new Error('Failed to fetch project details');
  }
  if (!tasksResponse.ok) {
    throw new Error('Failed to fetch tasks for the project');
  }
  if (!risksResponse.ok) {
    throw new Error('Failed to fetch risks for the project');
  }
  if (!resourcesResponse.ok) {
    throw new Error('Failed to fetch resources for the project');
  }

  const project = await projectResponse.json();
  const tasks = await tasksResponse.json();
  const risks = await risksResponse.json();
  const resources = await resourcesResponse.json();

  return {
    project,
    tasks,
    resources,
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

// Resource API Functions
export const createResource = async (projectId: number, data: { name: string; cost_per_day: number }): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/resources/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, project_id: projectId }),
  });
  if (!response.ok) throw new Error('Failed to create resource');
  return response.json();
};

export const updateResource = async (resourceId: number, data: Partial<{ name: string; cost_per_day: number }>): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update resource');
  return response.json();
};

export const deleteResource = async (resourceId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete resource');
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

// Simulation API

export const runSimulation = async (projectId: number, simulationRunId?: number): Promise<{ message: string; simulation_run_id: number }> => {
  console.log(`API: Starting simulation for project ${projectId}...`);
  const url = simulationRunId
    ? `${API_BASE_URL}/projects/${projectId}/simulate?simulation_run_id=${simulationRunId}`
    : `${API_BASE_URL}/projects/${projectId}/simulate`;
  const response = await fetch(url, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to start simulation');
  }
  return response.json();
};

export const getSimulationStatus = async (simulationRunId: number): Promise<SimulationStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/simulations/${simulationRunId}/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch simulation status');
  }
  return response.json();
};


export const getSimulationRun = async (simulationRunId: number): Promise<SimulationRun> => {
  const response = await fetch(`${API_BASE_URL}/simulations/${simulationRunId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch simulation run');
  }
  const simulationRun = await response.json();
  console.log('API: Raw SimulationRun response:', simulationRun);
  return simulationRun;
};

export const getSimulationResults = async (simulationRunId: number): Promise<SimulationResults> => {
  const run = await getSimulationRun(simulationRunId);
  return (run.results as SimulationResults) || {};
};

export const getAiInsights = (_simulationRunId: number): Promise<AiInsights> => {
  // TODO: Replace with real backend endpoint when available
  return withDelay({
    overallAssessment: "Insights not available (stub).",
    keyIssues: [],
    actionableRecommendations: [],
  });
};
