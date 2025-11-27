import React, { useState } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { Risk, Resource } from '../../types/domain';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RiskManagement from './RiskManagement'; // Import the new component

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
// ... (TabPanel function remains the same)
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`details-tabpanel-${index}`}
      aria-labelledby={`details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const getRiskColor = (level: 'Low' | 'Medium' | 'High'): 'success' | 'warning' | 'error' => {
    if (level === 'Low') return 'success';
    if (level === 'Medium') return 'warning';
    return 'error';
}

const TaskDetailsTabs: React.FC = () => {
  const { currentProject, risks, resources } = useAppSelector((state) => state.projects);
  const [value, setValue] = useState(0);
  const totalTaskCost = useAppSelector(state => state.projects.tasks.reduce((sum, task) => sum + task.cost, 0));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!currentProject) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Select a project to see details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="task details tabs" variant="fullWidth">
          <Tab label="Budget" icon={<MonetizationOnIcon />} iconPosition="start" />
          <Tab label="Risks" icon={<WarningIcon />} iconPosition="start" />
          <Tab label="Resources" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography variant="h6" gutterBottom>Project Budget</Typography>
        <List dense>
            <ListItem>
                <ListItemText primary="Total Planned Cost" secondary={`$${totalTaskCost.toLocaleString()}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Project Budget" secondary={`$${currentProject.budget.toLocaleString()}`} />
            </ListItem>
             <ListItem>
                <ListItemText primary="Contingency" secondary={`${currentProject.contingency}%`} />
            </ListItem>
        </List>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RiskManagement />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <List dense>
            {resources.map((resource: Resource) => (
                <ListItem key={resource.id}>
                    <ListItemText primary={resource.name} secondary={`Cost: $${resource.cost_per_day}/day`} />
                </ListItem>
            ))}
        </List>
      </TabPanel>
    </Box>
  );
};

export default TaskDetailsTabs;
