import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationEvent, KpiValues, Task } from '../types/domain';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'finished' | 'error';

// This will hold the dynamic state of a task during simulation
export type SimTaskState = Task;

export interface SimulationState {
  status: SimulationStatus;
  simulationId: string | null;
  currentDay: number;
  speed: number; // 1x, 2x, 4x
  events: SimulationEvent[];
  kpis: KpiValues;
  tasks: SimTaskState[]; // Add tasks to simulation state
  error: string | null;
  kpiHistory: { day: number; sv: number; cv: number }[];
}

const initialState: SimulationState = {
  status: 'idle',
  simulationId: null,
  currentDay: 0,
  speed: 1,
  events: [],
  kpis: { pv: 0, ev: 0, ac: 0, sv: 0, cv: 0, rei: 0 },
  tasks: [],
  error: null,
  kpiHistory: [],
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    startSimulation(state, action: PayloadAction<{ simulationId: string, initialTasks: Task[] }>) {
      state.status = 'running';
      state.simulationId = action.payload.simulationId;
      state.tasks = action.payload.initialTasks; // Initialize with the project tasks
      state.currentDay = 0;
      state.events = [{
        timestamp: Date.now(),
        type: 'SIM_START',
        message: 'Simulation started.'
      }];
    },
    pauseSimulation(state) {
      if (state.status === 'running') {
        state.status = 'paused';
      }
    },
    resumeSimulation(state) {
      if (state.status === 'paused') {
        state.status = 'running';
      }
    },
    stopSimulation(state) {
      state.status = 'finished';
      state.events.push({
        timestamp: Date.now(),
        type: 'SIM_END',
        message: 'Simulation stopped by user.'
      });
    },
    setSimulationSpeed(state, action: PayloadAction<number>) {
      state.speed = action.payload;
    },
    // This will be called by the mock simulation runner
    tick(state, action: PayloadAction<{ day: number, kpis: KpiValues, newEvents: SimulationEvent[], updatedTasks: SimTaskState[] }>) {
        if (state.status !== 'running') return;
        state.currentDay = action.payload.day;
        state.kpis = action.payload.kpis;
        state.events.push(...action.payload.newEvents);
        state.tasks = action.payload.updatedTasks; // Update task progress
        state.kpiHistory = [...state.kpiHistory, { day: action.payload.day, sv: action.payload.kpis.sv, cv: action.payload.kpis.cv }].slice(-200);
    },
    simulationError(state, action: PayloadAction<string>) {
        state.status = 'error';
        state.error = action.payload;
    }
  },
});

export const {
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  stopSimulation,
  setSimulationSpeed,
  tick,
  simulationError,
} = simulationSlice.actions;

export default simulationSlice.reducer;
