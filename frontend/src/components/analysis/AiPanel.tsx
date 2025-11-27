import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsightsIcon from '@mui/icons-material/Insights';

interface InsightItem {
  id: string;
  text: string;
}

interface AiInsights {
  overallAssessment: string;
  keyIssues: InsightItem[];
  actionableRecommendations: InsightItem[];
  provenance?: string;
}

const AiPanel: React.FC<{ insights: AiInsights | null }> = ({ insights }) => {
  if (!insights) return null;

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InsightsIcon color="primary" sx={{ mr: 1 }}/>
            <Typography variant="h5">AI Assistant Analysis</Typography>
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>Overall Assessment</Typography>
        <Typography variant="body1" paragraph>{insights.overallAssessment}</Typography>

        <Typography variant="subtitle1" gutterBottom>Key Issues Identified</Typography>
        <List dense>
            {insights.keyIssues.map((issue: InsightItem) => (
                <ListItem key={issue.id}>
                    <ListItemText primary={issue.text} />
                </ListItem>
            ))}
        </List>

        <Typography variant="subtitle1" gutterBottom>Actionable Recommendations</Typography>
        <List dense>
            {insights.actionableRecommendations.map((rec: InsightItem) => (
                <ListItem key={rec.id}>
                    <ListItemIcon>
                        <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={rec.text} />
                </ListItem>
            ))}
        </List>
        <Typography variant="caption" color="text.secondary">
          Why you see this: {insights.provenance ?? 'Derived from latest simulation run (risks, overruns, delays).'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AiPanel;
