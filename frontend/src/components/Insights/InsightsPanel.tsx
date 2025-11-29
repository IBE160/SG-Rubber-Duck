import React from 'react';
import { Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';

interface InsightsPanelProps {
  insights?: string;
  loading?: boolean;
  error?: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, loading, error }) => {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>AI Insights & Recommendations</Typography>
        {loading && <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><CircularProgress size={24} /> <span>Loading insights...</span></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && insights && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{insights}</Typography>
          </Box>
        )}
        {!loading && !error && !insights && (
          <Alert severity="info">No insights available. Run a simulation to get AI recommendations.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
