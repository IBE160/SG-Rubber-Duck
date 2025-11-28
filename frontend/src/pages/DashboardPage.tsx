import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import GanttPanel from '../components/simulation/GanttPanel';
import KpiDashboard from '../components/simulation/KpiDashboard';
import EventLog from '../components/simulation/EventLog';
import SimulationControls from '../components/simulation/SimulationControls'; // Import controls
import { useAppSelector } from '../store/hooks';

const DashboardPage: React.FC = () => {
  const { simulationResult } = useAppSelector((state) => state.projects);

  // The CPM result gives us calculated task details, but not in the GanttTask format.
  // We can enrich our base tasks with CPM data for the Gantt chart in a future step.
  // For now, we will just display the base tasks.
  // const simTasks = useAppSelector(state => state.simulation.tasks); // This was incorrect
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Simulation Controls</Typography>
            <SimulationControls />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: 420 }}>
            <Typography variant="h6" gutterBottom>Gantt Timeline</Typography>
            <Box sx={{ height: 340 }}>
              <GanttPanel /> 
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: 420, overflowY: 'auto' }}>
            {simulationResult ? (
              <>
                <Typography variant="h6" gutterBottom>Monte Carlo Simulation</Typography>
                <Typography variant="body2" title={`Based on ${simulationResult.iterations} iterations`}>
                  Base Duration (CPM): <strong>{simulationResult.base_duration.toFixed(1)} days</strong>
                </Typography>
                <Typography variant="body2">
                  Mean Duration: <strong>{simulationResult.mean_duration.toFixed(1)} days</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Std. Deviation: {simulationResult.std_dev_duration.toFixed(1)} days
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2">Probabilistic Durations:</Typography>
                  <Typography variant="body2">50% Chance (P50): <strong>{simulationResult.p50_duration.toFixed(1)} days</strong></Typography>
                  <Typography variant="body2">80% Chance (P80): <strong>{simulationResult.p80_duration.toFixed(1)} days</strong></Typography>
                  <Typography variant="body2">90% Chance (P90): <strong>{simulationResult.p90_duration.toFixed(1)} days</strong></Typography>
                </Box>
                <Typography variant="subtitle2">Duration Distribution:</Typography>
                <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                  <svg width="100%" height="100" viewBox={`0 0 100 ${Math.max(...simulationResult.duration_distribution)}`}>
                    {simulationResult.duration_distribution.map((value, index) => (
                      <rect
                        key={index}
                        x={(index / simulationResult.duration_distribution.length) * 100}
                        y={Math.max(...simulationResult.duration_distribution) - value}
                        width={100 / simulationResult.duration_distribution.length - 1}
                        height={value}
                        fill="#1976d2"
                      >
                        <title>{`~${simulationResult.bin_edges_duration[index].toFixed(0)} days: ${value} runs`}</title>
                      </rect>
                    ))}
                  </svg>
                </Box>
              </>
            ) : (
               <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                Run Simulation to see results.
               </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <KpiDashboard />
          </Paper>
        </Grid>
        {simulationResult && simulationResult.ai_assessment && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: 'primary.light' }}>
              <Typography variant="h6" gutterBottom>AI Insights</Typography>
              <Typography variant="body1" paragraph>
                {simulationResult.ai_assessment}
              </Typography>
              <Typography variant="subtitle2">Recommendations:</Typography>
              <ul>
                {simulationResult.ai_recommendations.map((rec, index) => (
                  <li key={index}><Typography variant="body2">{rec}</Typography></li>
                ))}
              </ul>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, height: 420 }}>
            <Typography variant="h6" gutterBottom>Event Log</Typography>
            <Box sx={{ height: 340 }}>
              <EventLog />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
