import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import AnalysisSummary from '../components/analysis/AnalysisSummary';
import AiPanel from '../components/analysis/AiPanel';
import { useAppSelector } from '../store/hooks';

const InsightsPage: React.FC = () => {
  const simKpis = useAppSelector(state => state.simulation.kpis);
  const simId = useAppSelector(state => state.simulation.simulationId);
  const risks = useAppSelector(state => state.projects.risks);

  const results = useMemo(() => ({
    finalCost: simKpis.ac || 950000,
    finalDuration: Math.max(1, Math.round(simKpis.ev || 190)),
    risksOccurred: risks.length || 0,
  }), [simKpis, risks]);

  const insights = useMemo(() => ({
    overallAssessment: simKpis.sv < 0 || simKpis.cv < 0
      ? 'Project trending behind schedule/cost; address critical tasks and overruns.'
      : 'Project is on track with current plan.',
    keyIssues: [
      { id: 'ki-1', text: `Schedule variance: ${simKpis.sv.toFixed(2)} (negative is behind).` },
      { id: 'ki-2', text: `Cost variance: ${simKpis.cv.toFixed(2)} (negative is over budget).` },
    ],
    actionableRecommendations: [
      { id: 'ar-1', text: 'Shift resources to critical tasks with highest delay impact.' },
      { id: 'ar-2', text: 'Add contingency buffer to MEP and critical path tasks if SV < 0.' },
    ],
    provenance: simId ? `Derived from simulation ${simId} (live KPIs)` : 'Derived from live KPIs',
  }), [simKpis, simId]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Insights</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <AnalysisSummary results={results} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <AiPanel insights={insights} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsightsPage;
