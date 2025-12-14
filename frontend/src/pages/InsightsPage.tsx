import React, { useMemo, useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import AnalysisSummary from '../components/analysis/AnalysisSummary';
import AiPanel from '../components/analysis/AiPanel';
import { useAppSelector } from '../store/hooks';
import { getAiInsights, AiInsights } from '../services/api';

const InsightsPage: React.FC = () => {
  const { simulationResult } = useAppSelector(state => state.projects);
  const simId = useAppSelector(state => state.simulation.simulationId);
  
  const [aiData, setAiData] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => ({
    finalCost: simulationResult?.total_cost ?? 0,
    finalDuration: simulationResult?.total_duration ?? 0,
    risksOccurred: simulationResult?.risk_events ?? 0,
  }), [simulationResult]);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!simId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getAiInsights(simId);
        setAiData(data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
        setError("Could not load AI analysis. Please run a simulation first.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [simId]);

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
          {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : error ? (
             <Alert severity="warning">{error}</Alert>
          ) : aiData ? (
             <AiPanel insights={{ ...aiData, provenance: `Simulation Run #${simId}` }} />
          ) : (
             <Alert severity="info">Run a simulation to generate AI insights.</Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsightsPage;
