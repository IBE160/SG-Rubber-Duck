import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Container, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as api from '../services/api';
import { SimulationResults } from '../types/domain';

import AnalysisSummary from '../components/analysis/AnalysisSummary';
import AiPanel from '../components/analysis/AiPanel';
import GanttPanel from '../components/simulation/GanttPanel'; // Re-used for final Gantt
import EventLog from '../components/simulation/EventLog'; // Re-used

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const AnalysisPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const simulationId = useAppSelector(state => state.simulation.simulationId);
  const tasks = useAppSelector(state => state.projects.tasks);
  const risks = useAppSelector(state => state.projects.risks);
  const simTasks = useAppSelector(state => state.simulation.tasks);
  
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [insights, setInsights] = useState<api.AiInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }
    if (!simulationId) {
        // In a real app, you might fetch the last completed sim for this project
        console.warn("No simulation was run in this session.");
        setLoading(false);
        return;
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const [simResults, aiInsights] = await Promise.all([
                api.getSimulationResults(simulationId),
                api.getAiInsights(simulationId)
            ]);
            const normalized: SimulationResults = {
              ...simResults,
              finalCost: simResults.total_cost ?? simResults.finalCost ?? 0,
              finalDuration: simResults.total_duration ?? simResults.finalDuration ?? 0,
              risksOccurred: simResults.risk_events ?? simResults.risksOccurred ?? 0,
            };
            setResults(normalized);
            setInsights(aiInsights);
        } catch (error) {
            console.error("Failed to fetch analysis data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [projectId, simulationId, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const taskSource = simTasks.length ? simTasks : tasks;

  const taskCostRows = useMemo(() => {
    if (!taskSource.length) return [];
    return taskSource.map(t => ({
      id: t.id,
      name: t.text,
      planned: t.cost ?? 0,
      actual: Math.round((t.cost ?? 0) * 1.05), // Demo: 5% over plan
      variance: Math.round((t.cost ?? 0) * 0.05),
    }));
  }, [taskSource]);

  const riskRows = useMemo(() => risks.map(r => ({
    id: r.id,
    desc: r.description,
    prob: r.probability,
    costImpact: r.cost_impact,
    durationImpact: r.duration_impact,
    severity: r.probability * r.cost_impact,
  })), [risks]);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading Analysis Report...</Typography>;
  }
  
  if (!results || !insights) {
    return <Typography sx={{ p: 4 }}>Could not load analysis report. Please run a simulation first.</Typography>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Analysis Report for Project {projectId}
      </Typography>
      
      {/* Top: KPI Summary */}
      <AnalysisSummary results={results} />
      
      {/* Mid: AI Assistant */}
      <AiPanel insights={insights} />
      
      {/* Bottom: Tabs for details */}
      <Paper sx={{ mt: 2 }} elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Analysis detail tabs">
            <Tab label="Final Gantt" id="analysis-tab-0" aria-controls="analysis-panel-0" />
            <Tab label="Cost Breakdown" id="analysis-tab-1" aria-controls="analysis-panel-1" />
            <Tab label="Risk Analysis" id="analysis-tab-2" aria-controls="analysis-panel-2" />
            <Tab label="Event Log" id="analysis-tab-3" aria-controls="analysis-panel-3" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
            <Box sx={{height: 400}}>
                <GanttPanel tasksOverride={simTasks.length ? simTasks : tasks} />
            </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Table size="small" aria-label="Cost breakdown table">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell align="right">Planned Cost</TableCell>
                <TableCell align="right">Actual Cost</TableCell>
                <TableCell align="right">Variance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskCostRows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">${row.planned.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.actual.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ color: row.variance > 0 ? 'error.main' : 'success.main' }}>
                    ${row.variance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
         <TabPanel value={tabValue} index={2}>
          <Table size="small" aria-label="Risk analysis table">
            <TableHead>
              <TableRow>
                <TableCell>Risk</TableCell>
                <TableCell align="right">Probability</TableCell>
                <TableCell align="right">Cost Impact</TableCell>
                <TableCell align="right">Duration Impact (days)</TableCell>
                <TableCell align="right">Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskRows.map(r => (
                <TableRow key={r.id} sx={{ bgcolor: r.severity > 50000 ? 'error.light' : undefined }}>
                  <TableCell>{r.desc}</TableCell>
                  <TableCell align="right">{(r.prob * 100).toFixed(1)}%</TableCell>
                  <TableCell align="right">${r.costImpact.toLocaleString()}</TableCell>
                  <TableCell align="right">{r.durationImpact}</TableCell>
                  <TableCell align="right">${r.severity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
            <Box sx={{height: 400, overflowY: 'auto'}}>
                <EventLog />
            </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AnalysisPage;
