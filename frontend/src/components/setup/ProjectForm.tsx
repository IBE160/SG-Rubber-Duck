import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useCreateProject, useUpdateProject } from '../../services/queries';
import { Project } from '../../types/domain';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createProjectMutation = useCreateProject();
  // We need to call the hook, but we only use the mutation function if initialData exists.
  // Since hooks can't be conditional, we initialize it with a dummy ID (e.g. 0) or the actual ID if present.
  // Ideally, useUpdateProject returns a mutation object we can use. The query key invalidation happens in the hook.
  // Let's assume useUpdateProject(id) works.
  const updateProjectMutation = useUpdateProject(initialData?.id || 0);

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setBudget(initialData.budget?.toString() || '');
      setStartDate(initialData.start_date);
      setEndDate(initialData.end_date);
    } else if (open && !initialData) {
        // Reset if opening in create mode
        setName('');
        setDescription('');
        setBudget('');
        setStartDate('');
        setEndDate('');
    }
  }, [open, initialData]);

  const isPending = createProjectMutation.isPending || updateProjectMutation.isPending;

  const handleSubmit = async () => {
    try {
      const projectData = {
        name,
        description,
        budget: parseFloat(budget),
        start_date: startDate,
        end_date: endDate,
      };

      if (initialData) {
        await updateProjectMutation.mutateAsync(projectData);
      } else {
        await createProjectMutation.mutateAsync(projectData);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Project' : 'Create New Project'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <TextField
            label="Scope / Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
          <TextField
            label="Budget"
            type="number"
            fullWidth
            margin="normal"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            disabled={isPending}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isPending}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isPending}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isPending || !name.trim()}
        >
          {isPending ? <CircularProgress size={24} /> : (initialData ? 'Save' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectForm;

