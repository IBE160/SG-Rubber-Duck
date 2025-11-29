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
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProjectDetails, setCurrentProject } from '../../store/projectSlice';
import { useProjects, useDeleteProject } from '../../services/queries';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Use TanStack Query to fetch projects
  const { data: projects = [], isLoading, error } = useProjects();
  const deleteProjectMutation = useDeleteProject();
  
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
        No projects yet. Create one to get started.
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
      <Button variant="contained" fullWidth onClick={handleOpenForm} sx={{ mb: 2 }}>
        New Project
      </Button>
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
