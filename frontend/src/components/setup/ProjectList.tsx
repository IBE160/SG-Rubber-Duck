import React, { useState } from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Stack,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProjectDetails, setCurrentProject } from '../../store/projectSlice';
import { useProjects, useDeleteProject } from '../../services/queries';
import { createProject, createTask, createRisk, createResource, updateTask } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  // Use TanStack Query to fetch projects
  const { data: projects = [], isLoading, error } = useProjects();
  const deleteProjectMutation = useDeleteProject();
  const queryClient = useQueryClient();
  
  const handleSelectProject = (projectId: number) => {
    dispatch(fetchProjectDetails(projectId));
  };

  const handleDeleteProject = async (projectId: number) => {
    const projectName = projects.find((p) => p.id === projectId)?.name || 'this project';
    const confirmed = window.confirm(`Delete ${projectName}? This action cannot be undone.`);
    if (!confirmed) return;
    await deleteProjectMutation.mutateAsync(projectId);
    if (currentProject?.id === projectId) {
      dispatch(setCurrentProject(null));
    }
  };

  const handleLoadDemo = async () => {
    setIsCreatingDemo(true);
    try {
      // 1. Create Project
      console.log('Creating demo project...');
      const project = await createProject({
        name: "High-Rise Office Complex",
        description: "Construction of a 20-story office building with modern amenities.",
        budget: 5000000,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      const pid = project.id;
      console.log('Project created:', pid);

      // 2. Create Tasks (Sequential)
      const t1 = await createTask(pid, { text: "Site Preparation", duration: 10, start_date: project.start_date, progress: 0, parent: null });
      const t2 = await createTask(pid, { text: "Foundation", duration: 20, start_date: project.start_date, progress: 0, parent: null });
      const t3 = await createTask(pid, { text: "Structural Steel", duration: 30, start_date: project.start_date, progress: 0, parent: null });
      const t4 = await createTask(pid, { text: "Exterior Cladding", duration: 15, start_date: project.start_date, progress: 0, parent: null });
      const t5 = await createTask(pid, { text: "Interior Fit-out", duration: 25, start_date: project.start_date, progress: 0, parent: null });

      // Add dependencies (Predecessors)
      const updatePreds = async (tid: number, preds: number[]) => {
         try {
             await updateTask(tid, { predecessors: preds });
         } catch (e) { console.warn("Failed to link tasks", e); }
      };

      await updatePreds(t2.id, [t1.id]);
      await updatePreds(t3.id, [t2.id]);
      await updatePreds(t4.id, [t3.id]);
      await updatePreds(t5.id, [t4.id]);

      // 3. Create Risks
      await createRisk(pid, { description: "Severe Weather", probability: 0.1, impact: 'High', duration_impact: 5, affected_task_ids: [] });
      await createRisk(pid, { description: "Supply Chain Delay", probability: 0.2, impact: 'Medium', duration_impact: 10, affected_task_ids: [] });

      // 4. Create Resources
      await createResource(pid, { name: "Construction Crew", cost_per_day: 1000 });
      await createResource(pid, { name: "Crane", cost_per_day: 500 });

      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Select the new project
      dispatch(fetchProjectDetails(pid));

    } catch (e) {
      console.error("Failed to create demo project", e);
      alert(`Failed to create demo project: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  let content;

  if (isLoading) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    content = (
      <Alert severity="error">
        Error: {error instanceof Error ? error.message : 'Failed to fetch projects'}
      </Alert>
    );
  } else if (projects.length === 0) {
    content = (
      <Typography color="textSecondary" sx={{ py: 2 }}>
        No projects yet. Create one or load a demo to get started.
      </Typography>
    );
  } else {
    content = (
      <List>
        {projects.map((project) => (
          <ListItem 
            key={project.id} 
            disablePadding
            secondaryAction={
              <Tooltip title="Delete project">
                <IconButton edge="end" onClick={() => handleDeleteProject(project.id)} size="small">
                  <DeleteOutlineIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            }
            sx={{ mb: 1 }}
          >
            <ListItemButton
              selected={currentProject?.id === project.id}
              onClick={() => handleSelectProject(project.id)}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.5,
                background: currentProject?.id === project.id 
                  ? 'linear-gradient(135deg, rgba(70,130,255,0.25), rgba(70,130,255,0.1))'
                  : 'rgba(255,255,255,0.04)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))',
                },
              }}
            >
              <ListItemText 
                primary={project.name} 
                secondary={project.description} 
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
        Projects
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleOpenForm}
          disabled={isCreatingDemo}
        >
          New Project
        </Button>
        <Tooltip title="Load a predefined project with tasks and risks to test the simulation">
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={handleLoadDemo}
            disabled={isCreatingDemo}
            startIcon={isCreatingDemo ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
          >
            {isCreatingDemo ? 'Loading...' : 'Demo'}
          </Button>
        </Tooltip>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {content}
      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
      />
    </Paper>
  );
};

export default ProjectList;
