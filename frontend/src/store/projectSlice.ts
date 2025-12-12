import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, Task, Resource, Risk, SimulationResults } from '../types/domain';
import * as api from '../services/api';
import { ProjectCreate, TaskCreate, TaskUpdate, RiskCreate, RiskUpdate } from '../types/api';

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  resources: Resource[];
  risks: Risk[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  simulationResult: SimulationResults | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  tasks: [],
  resources: [],
  risks: [],
  status: 'idle',
  error: null,
  simulationResult: null,
};

// --- Async Thunks ---
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await api.getProjects();
  return response;
});

export const fetchProjectDetails = createAsyncThunk('projects/fetchProjectDetails', async (projectId: number) => {
  const response = await api.getProjectDetails(projectId);
  return response;
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData: ProjectCreate) => {
  const response = await api.createProject(projectData);
  return response;
});

export const createTask = createAsyncThunk(
  'projects/createTask',
  async ({ projectId, taskData }: { projectId: number; taskData: TaskCreate }) => {
    const response = await api.createTask(projectId, taskData);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'projects/updateTask',
  async ({ taskId, taskData }: { taskId: number; taskData: TaskUpdate }) => {
    const response = await api.updateTask(taskId, taskData);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  'projects/deleteTask',
  async (taskId: number) => {
    await api.deleteTask(taskId);
    // Optionally refetch tasks or remove from state locally
    // If we have a current project, refetch its details to get updated task list
    // This is one strategy, another is to optimistic update and then handle errors
    // For now, will let the extraReducer handle local removal, and rely on full fetch
    // if needed.
    return taskId; // Return ID to remove from state
  }
);

export const runSimulation = createAsyncThunk(
  'projects/runSimulation',
  async (projectId: number) => {
    const response = await api.runSimulation(projectId);
    return response;
  }
);

export const fetchSimulationResult = createAsyncThunk(
  'projects/fetchSimulationResult',
  async (simulationRunId: number) => {
    const response = await api.getSimulationResults(simulationRunId);
    return response;
  }
);

export const createRisk = createAsyncThunk(
  'projects/createRisk',
  async ({ projectId, riskData }: { projectId: number; riskData: RiskCreate }) => {
    const response = await api.createRisk(projectId, riskData);
    return response;
  }
);

export const updateRisk = createAsyncThunk(
  'projects/updateRisk',
  async ({ riskId, riskData }: { riskId: number; riskData: RiskUpdate }) => {
    const response = await api.updateRisk(riskId, riskData);
    return response;
  }
);

export const deleteRisk = createAsyncThunk(
  'projects/deleteRisk',
  async (riskId: number) => {
    await api.deleteRisk(riskId);
    return riskId;
  }
);

// --- Slice Definition ---
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject(state, action: PayloadAction<number | null>) {
        if (action.payload === null) {
            state.currentProject = null;
        } else {
            state.currentProject = state.projects.find(p => p.id === action.payload) || null;
        }
    },
    // The following reducers will be used by WbsTable, but will dispatch async thunks later
    addTask(state, action: PayloadAction<Partial<Task>>) {
        // This will be refactored to dispatch an async thunk
        const newTask: Task = {
          id: -1, // Temporary ID, will be replaced by backend ID
          text: action.payload.text || 'New Task',
          start_date: action.payload.start_date || new Date().toISOString().slice(0,10),
          duration: action.payload.duration ?? 1,
          progress: action.payload.progress ?? 0,
          parent: action.payload.parent ?? null,
          predecessors: [], // Predecessors not yet handled in backend Task model
          cost: action.payload.cost ?? 0,
          resource_id: action.payload.resource_id,
          project_id: state.currentProject?.id ?? -1, // Temporary project_id
        };
        state.tasks.push(newTask);
    },
    updateTaskParent(state, action: PayloadAction<{ id: number; parent: number | null }>) {
        const task = state.tasks.find(t => t.id === action.payload.id);
        if (task) {
            task.parent = action.payload.parent;
        }
    },
    updateTaskField(state, action: PayloadAction<{ id: number; field: keyof Task; value: unknown }>) {
        const task = state.tasks.find(t => t.id === action.payload.id);
        if (task) {
          const { field, value } = action.payload;
          // Narrowing based on field
          switch (field) {
            case 'text':
            case 'start_date':
              task[field] = (value as string) ?? '';
              break;
            case 'parent':
            case 'duration':
            case 'progress':
            case 'cost':
              task[field] = Number(value);
              break;
            case 'predecessors':
              task[field] = value as number[];
              break;
            case 'resource_id':
                task[field] = (value as number);
                break;
            default:
              break;
          }
        }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // fetchProjectDetails
      .addCase(fetchProjectDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload.project;
        state.tasks = action.payload.tasks;
        state.resources = action.payload.resources;
        state.risks = action.payload.risks;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch project details';
      })
      // createProject
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.status = 'succeeded';
      })
      // createTask
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.status = 'succeeded';
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Replace updated task
        }
        state.status = 'succeeded';
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.status = 'succeeded';
      })
      // runSimulation
      .addCase(runSimulation.pending, (state) => {
        state.status = 'loading';
        state.simulationResult = null; // Clear previous results
      })
      .addCase(runSimulation.fulfilled, (state) => {
        // Now only indicates that the simulation has started in the background
        state.status = 'loading'; // Stay in loading state until results are fetched
      })
      .addCase(runSimulation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to start simulation';
      })
      // fetchSimulationResult
      .addCase(fetchSimulationResult.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimulationResult.fulfilled, (state, action) => {
        state.simulationResult = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSimulationResult.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch simulation result';
      })
      // createRisk
      .addCase(createRisk.fulfilled, (state, action) => {
        state.risks.push(action.payload);
        state.status = 'succeeded';
      })
      // updateRisk
      .addCase(updateRisk.fulfilled, (state, action) => {
        const index = state.risks.findIndex((risk) => risk.id === action.payload.id);
        if (index !== -1) {
          state.risks[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      // deleteRisk
      .addCase(deleteRisk.fulfilled, (state, action) => {
        state.risks = state.risks.filter((risk) => risk.id !== action.payload);
        state.status = 'succeeded';
      });
  },
});

export const { setCurrentProject, addTask, updateTaskParent, updateTaskField } = projectSlice.actions;

export default projectSlice.reducer;
