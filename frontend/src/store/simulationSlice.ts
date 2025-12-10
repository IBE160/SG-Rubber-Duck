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
    resetSimulation() {
      return initialState;
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
            if (!state.tasks.length) return;
      
            const normalizedType = evt.event_type || evt.type;
            
            // Calculate derived dates based on simulation day
            // Assuming the first task's start date is the project start anchor
            const projectStart = new Date(state.tasks[0]?.start_date || Date.now()).getTime();
      
            if (normalizedType === 'day_advanced') {
                const day = (evt.details?.day as number) || state.currentDay + 1;
                state.currentDay = day;
            }
      
            // Update Tasks
            const tasks = state.tasks.map(t => {
              // Handle explicit task events
              if (evt.task_id === t.id) {
                  if (normalizedType === 'task_started') {
                      // Update start date to match actual simulation start
                      const newStart = new Date(projectStart + (state.currentDay * 86400000)).toISOString().split('T')[0];
                      return { ...t, progress: 0, start_date: newStart };
                  }
                  if (normalizedType === 'task_completed') {
                      return { ...t, progress: 1 };
                  }
              }
      
              // Handle day_advanced for active tasks
              if (normalizedType === 'day_advanced') {
                  const activeTasks = (evt.details?.active_tasks as number[]) || [];
                  if (activeTasks.includes(t.id)) {
                      const duration = t.duration || 1;
                      // Increment progress, but cap at 0.99 until explicitly completed
                      const increment = 1 / duration;
                      const nextProgress = Math.min(0.99, (t.progress ?? 0) + increment);
                      return { ...t, progress: nextProgress };
                  }
              }
              
              return t;
            });
            state.tasks = tasks;
            
            // Update KPIs
            if (normalizedType === 'task_completed') {
                const cost = (evt.details?.cost as number) || 0;
                state.kpis.ac += cost;
            }
      
            if (normalizedType === 'day_advanced') {
                // Calculate EV (Earned Value)
                const ev = state.tasks.reduce((sum, t) => sum + (t.cost * (t.progress || 0)), 0);
                state.kpis.ev = ev;
                
                // Calculate PV (Planned Value) - Simplified: Assume linear burn of total budget over project duration
                // A better approximation would require original baseline schedule
                // For now, let's use a proxy: PV = EV (Schedule Variance = 0) unless we have baseline
                // Or we can approximate PV based on day/total_duration * budget
                // Let's leave PV as is or rough estimate to avoid wild SV
                // state.kpis.pv = ... 
      
                // CV = EV - AC
                state.kpis.cv = state.kpis.ev - state.kpis.ac;
                
                // SV = EV - PV (skipping for now as PV is hard to estimate without baseline obj)
                // state.kpis.sv = ...
      
                state.kpiHistory.push({ day: state.currentDay, sv: state.kpis.sv, cv: state.kpis.cv });
            }
      
            if (normalizedType === 'simulation_completed') {
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
  resetSimulation,
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
