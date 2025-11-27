import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProjects, fetchProjectDetails } from '../../store/projectSlice';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, status, error, currentProject } = useAppSelector((state) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);
  
  const handleSelectProject = (projectId: string) => {
    dispatch(fetchProjectDetails(projectId));
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  let content;

  if (status === 'loading') {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (status === 'succeeded') {
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
  } else if (status === 'failed') {
    content = <Typography color="error">Error: {error}</Typography>;
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