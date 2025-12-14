import React from 'react';
import { Typography, Box, Card, CardContent, Grid, Alert } from '@mui/material';
import { useAppSelector } from '../../store/hooks';

const KpiCard: React.FC<{ title: string; value: string; color?: string, description?: string }> = ({ title, value, color, description }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
        <CardContent>
            <Typography color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="div" sx={{ color: color || 'text.primary' }}>
                {value}
            </Typography>
            {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
        </CardContent>
    </Card>
);

const KpiDashboard: React.FC = () => {
  const { simulationResult, currentProject, tasks } = useAppSelector(state => state.projects);
  const { kpis, status: simStatus } = useAppSelector(state => state.simulation);
  const simEvents = useAppSelector(state => state.simulation.events);

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';
    return `$${Math.round(value).toLocaleString()}`;
  };

  if (!currentProject) {
    return <Typography>Select a project to see KPIs.</Typography>;
  }

  const budget = currentProject.budget || 0;
  const taskCompletedCost = simEvents
    .filter(e => e.event_type === 'task_completed' && typeof e.details?.cost === 'number')
    .reduce((sum, e) => sum + (e.details?.cost as number), 0);
  const lastDayEvent = simEvents.find(e => e.event_type === 'day_advanced');
  const liveDuration = (lastDayEvent?.details as any)?.day || 0;

  const totalCost = simulationResult?.total_cost ?? taskCompletedCost;
  const totalDuration = simulationResult?.total_duration ?? liveDuration;
  const tasksCompleted = simulationResult?.tasks_completed ?? simEvents.filter(e => e.event_type === 'task_completed').length;
  const riskEvents = simulationResult?.risk_events ?? simEvents.filter(e => e.event_type === 'risk_triggered').length;
  const baseDuration = simulationResult?.base_duration ?? undefined;
  
  const criticalPathIds = simulationResult?.critical_path ?? [];
  console.log('KPI: criticalPathIds', criticalPathIds);
  console.log('KPI: tasks', tasks);
  const criticalPathNames = criticalPathIds
    .map(id => tasks.find(t => t.id === id)?.text)
    .filter(Boolean);
  console.log('KPI: criticalPathNames', criticalPathNames);
  const criticalPathString = criticalPathNames.join(' → ') || 'N/A';

  const variance = totalCost - budget;

  // Use live KPIs if simulation is running, otherwise use final result values if available
  const cv = simStatus === 'running' ? kpis.cv : 0; // Final CV is not typically stored in simple result, but variance represents final CV
  const sv = simStatus === 'running' ? kpis.sv : 0; 

  if (!simulationResult && simEvents.length === 0) {
    return (
        <Alert severity="info">Run a simulation to view Key Performance Indicators.</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Key Performance Indicators</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Project Budget" value={formatCurrency(budget)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Actual Cost" value={formatCurrency(totalCost)} description="Includes risk impacts when present." color={totalCost > budget ? 'error.main' : 'success.main'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard 
              title="Duration (days)" 
              value={totalDuration?.toString() || '0'} 
              description={baseDuration ? `Base CPM: ${baseDuration} days` : 'Live estimate'}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard 
              title="Budget Variance (VAC)" 
              value={formatCurrency(variance)} 
              description="Final Projected Variance"
              color={variance > 0 ? 'error.main' : 'success.main'}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
             <KpiCard 
              title="Schedule Variance (SV)" 
              value={formatCurrency(sv)} 
              description="EV - PV (Live)"
              color={sv < 0 ? 'warning.main' : 'success.main'}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
             <KpiCard 
              title="Cost Variance (CV)" 
              value={formatCurrency(cv)} 
              description="EV - AC (Live)"
              color={cv < 0 ? 'warning.main' : 'success.main'}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Tasks Completed" value={tasksCompleted.toString()} description="Completed during this run." />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Risk Events" value={riskEvents.toString()} description="Triggered during this run." color={riskEvents > 0 ? 'warning.main' : 'success.main'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Critical / Driving Path" value={criticalPathString} description="From CPM baseline." />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KpiDashboard;
