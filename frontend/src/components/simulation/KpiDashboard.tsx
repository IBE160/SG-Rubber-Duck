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
  const { simulationResult, currentProject } = useAppSelector(state => state.projects);

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';
    return `$${Math.round(value).toLocaleString()}`;
  };

  if (!currentProject) {
    return <Typography>Select a project to see KPIs.</Typography>;
  }

  if (!simulationResult) {
    return (
        <Alert severity="info">Run a simulation to view Key Performance Indicators.</Alert>
    );
  }
  
  const budget = currentProject.budget;
  const baseCost = simulationResult.base_cost;
  const p80Cost = simulationResult.p80_cost;
  const overrun = p80Cost - budget;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Key Performance Indicators</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Project Budget" value={formatCurrency(budget)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Base Cost (CPM)" value={formatCurrency(baseCost)} description="Deterministic cost without risks." />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard 
              title="P80 Cost" 
              value={formatCurrency(p80Cost)} 
              description="80% confidence the project will not exceed this cost."
              color={p80Cost > budget ? 'error.main' : 'success.main'}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <KpiCard 
              title="Potential Overrun (P80)" 
              value={formatCurrency(overrun)} 
              description="Difference between P80 Cost and Budget."
              color={overrun > 0 ? 'error.main' : 'text.primary'}
            />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KpiDashboard;
