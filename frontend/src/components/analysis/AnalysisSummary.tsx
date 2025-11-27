import React from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography } from '@mui/material';

interface AnalysisResults {
  finalCost: number;
  finalDuration: number;
  risksOccurred: number;
}

const KpiCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <Card elevation={3}>
        <CardContent>
            <Typography color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h5" component="div" sx={{ color }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);


const AnalysisSummary: React.FC<{ results: AnalysisResults | null }> = ({ results }) => {
  if (!results) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={4}>
        <KpiCard title="Final Cost" value={`$${results.finalCost.toLocaleString()}`} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard title="Final Duration" value={`${results.finalDuration} days`} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard title="Risks Occurred" value={results.risksOccurred} color="warning.main" />
      </Grid>
    </Grid>
  );
};

export default AnalysisSummary;
