import React, { useRef, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { SimulationEventType } from '../../types/domain';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const getEventIcon = (type: SimulationEventType) => {
    switch (type) {
        case 'SIM_START': return <PlayArrowIcon color="success" />;
        case 'SIM_END': return <StopIcon color="error" />;
        case 'TASK_START': return <PlayCircleOutlineIcon color="primary" />;
        case 'TASK_END': return <CheckCircleOutlineIcon color="primary" />;
        case 'RISK_EVENT': return <WarningAmberIcon color="warning" />;
        default: return <PlayCircleOutlineIcon color="disabled" />;
    }
}

const EventLog: React.FC = () => {
  const events = useAppSelector(state => state.simulation.events.slice(-200));
  const endOfLogRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6">Event Log</Typography>
      <List dense sx={{ height: '100%', overflowY: 'auto', p: 0 }}>
        {events.map((event, index) => (
          <ListItem key={index}>
            <ListItemIcon sx={{ minWidth: 32 }}>
                {getEventIcon(event.type)}
            </ListItemIcon>
            <ListItemText
              primary={event.message}
              secondary={new Date(event.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
        <div ref={endOfLogRef} />
      </List>
    </Box>
  );
};

export default EventLog;
