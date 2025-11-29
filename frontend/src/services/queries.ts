/**
 * TanStack React Query Hooks
 * Manages server state and caching for all API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { ProjectCreate, TaskCreate, RiskCreate } from '../types/api';

// Query Keys for organized caching
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    list: () => [...queryKeys.projects.all, 'list'] as const,
    details: (id: number) => [...queryKeys.projects.all, 'details', id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    byProject: (projectId: number) => [...queryKeys.tasks.all, 'byProject', projectId] as const,
  },
  risks: {
    all: ['risks'] as const,
    byProject: (projectId: number) => [...queryKeys.risks.all, 'byProject', projectId] as const,
  },
  simulations: {
    all: ['simulations'] as const,
    result: (projectId: number) => [...queryKeys.simulations.all, 'result', projectId] as const,
  },
};

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * Fetch all projects with caching and refetching
 */
export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: api.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch a single project with all its details (project, tasks, risks, resources)
 */
export const useProjectDetails = (projectId: number | null) => {
  return useQuery({
    queryKey: queryKeys.projects.details(projectId || 0),
    queryFn: () =>
      projectId
        ? api.getProjectDetails(projectId)
        : Promise.reject(new Error('No project ID')),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Create a new project mutation
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => api.createProject(data),
    onSuccess: () => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
    },
  });
};

/**
 * Create a task mutation
 */
export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreate) => api.createTask(projectId, data),
    onSuccess: () => {
      // Invalidate project details to refetch tasks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

/**
 * Update a task mutation
 */
export const useUpdateTask = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: number;
      data: Partial<TaskCreate>;
    }) => api.updateTask(taskId, data),
    onSuccess: () => {
      // Invalidate project details to refetch tasks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

/**
 * Delete a task mutation
 */
export const useDeleteTask = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => api.deleteTask(taskId),
    onSuccess: () => {
      // Invalidate project details to refetch tasks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

// ============================================================================
// RISKS
// ============================================================================

/**
 * Create a risk mutation
 */
export const useCreateRisk = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RiskCreate) => api.createRisk(projectId, data),
    onSuccess: () => {
      // Invalidate project details to refetch risks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

/**
 * Update a risk mutation
 */
export const useUpdateRisk = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      riskId,
      data,
    }: {
      riskId: number;
      data: Partial<RiskCreate>;
    }) => api.updateRisk(riskId, data),
    onSuccess: () => {
      // Invalidate project details to refetch risks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

/**
 * Delete a risk mutation
 */
export const useDeleteRisk = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (riskId: number) => api.deleteRisk(riskId),
    onSuccess: () => {
      // Invalidate project details to refetch risks
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.details(projectId),
      });
    },
  });
};

// ============================================================================
// SIMULATIONS
// ============================================================================

/**
 * Get simulation results for a simulation run (stub until backend provides endpoint)
 */
export const useSimulationResult = (simulationRunId: number | null) => {
  return useQuery({
    queryKey: queryKeys.simulations.result(simulationRunId || 0),
    queryFn: () =>
      simulationRunId != null
        ? api.getSimulationResults(simulationRunId)
        : Promise.reject(new Error('No simulation run ID')),
    enabled: simulationRunId != null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Run a simulation mutation
 */
export const useRunSimulation = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.runSimulation(projectId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.simulations.result(res.simulation_run_id),
      });
    },
  });
};
