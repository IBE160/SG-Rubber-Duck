import React from 'react';
import { Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProjectList from '../components/setup/ProjectList';
import WbsTable from '../components/setup/WbsTable';
import TaskDetailsTabs from '../components/setup/TaskDetailsTabs';
import SetupFooter from '../components/setup/SetupFooter';

const SetupPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'hidden' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Panel: Project List */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
              <ProjectList />
            </Paper>
          </Grid>

          {/* Middle Panel: WBS Table */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
              <WbsTable />
            </Paper>
          </Grid>

          {/* Right Panel: Details Tabs */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
              <TaskDetailsTabs />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <SetupFooter />
    </Box>
  );
};

export default SetupPage;