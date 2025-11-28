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
  Alert
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProjectDetails } from '../../store/projectSlice';
import { useProjects } from '../../services/queries';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Use TanStack Query to fetch projects
  const { data: projects = [], isLoading, error } = useProjects();
  
  const handleSelectProject = (projectId: number) => {
    dispatch(fetchProjectDetails(projectId));
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
          <ListItem key={project.id} disablePadding>
            <ListItemButton
              selected={currentProject?.id === project.id}
              onClick={() => handleSelectProject(project.id)}
            >
              <ListItemText 
                primary={project.name} 
                secondary={project.description} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>
      <Button variant="contained" fullWidth onClick={handleOpenForm}>
        New Project
      </Button>
      <Divider sx={{ my: 2 }} />
      {content}
      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
      />
    </>
  );
};

export default ProjectList;

