import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationEvent, KpiValues, Task } from '../types/domain';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'finished' | 'error';

// This will hold the dynamic state of a task during simulation
export type SimTaskState = Task;

export interface SimulationState {
  status: SimulationStatus;
  simulationId: number | null;
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
    startSimulation(state, action: PayloadAction<{ simulationId: number; initialTasks: Task[] }>) {
      state.status = 'running';
      state.simulationId = action.payload.simulationId;
      state.tasks = action.payload.initialTasks;
      state.currentDay = 0;
      state.events = [];
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
    pushEvent(state, action: PayloadAction<SimulationEvent>) {
      const normalizedType = (action.payload.event_type as any) || action.payload.type || 'event';
      state.events = [...state.events.slice(-199), { ...action.payload, type: normalizedType }];
      if (normalizedType === 'SIM_END' || normalizedType === 'simulation_completed') {
        state.status = 'finished';
      }
    },
  applyTaskEvent(state, action: PayloadAction<SimulationEvent>) {
      const evt = action.payload;
      if (!state.tasks.length || (!evt.task_id && !evt.task_id)) return;
      const tid = evt.task_id;
      const tasks = state.tasks.map(t => {
        if (t.id !== tid) return t;
        if (evt.type === 'task_started' || evt.event_type === 'task_started') {
          return { ...t, progress: 0 };
        }
        if (evt.type === 'day_advanced' || evt.event_type === 'day_advanced') {
          const duration = t.duration || 1;
          const increment = 1 / duration;
          const nextProgress = Math.min(1, (t.progress ?? 0) + increment);
          return { ...t, progress: nextProgress };
        }
        if (evt.type === 'task_completed' || evt.event_type === 'task_completed') {
          return { ...t, progress: 1 };
        }
        return t;
      });
      state.tasks = tasks;
      if (evt.event_type === 'simulation_completed') {
        state.status = 'finished';
      }
    },
    tick(state, action: PayloadAction<{ day: number; kpis: KpiValues; newEvents: SimulationEvent[]; updatedTasks: SimTaskState[] }>) {
      if (state.status !== 'running') return;
      state.currentDay = action.payload.day;
      state.kpis = action.payload.kpis;
      state.events = [...state.events, ...action.payload.newEvents].slice(-200);
      state.tasks = action.payload.updatedTasks;
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
  pushEvent,
  applyTaskEvent,
  tick,
  simulationError,
} = simulationSlice.actions;

export default simulationSlice.reducer;
