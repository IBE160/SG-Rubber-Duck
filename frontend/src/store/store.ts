import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import simulationReducer from './simulationSlice';

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    simulation: simulationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// It's a good practice to create typed hooks for convenience
// Create a file `src/store/hooks.ts` for these
