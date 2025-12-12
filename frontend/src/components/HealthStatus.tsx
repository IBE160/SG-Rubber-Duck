import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const HealthStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const checkHealth = async () => {
    try {
      console.log(`Checking health at: ${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setIsOnline(true);
      } else {
        console.warn('Health check failed with status:', response.status);
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Health check connection error:', error);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) return null; // Initial state

  return (
    <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 9999 }}>
      <Chip
        icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
        label={isOnline ? "Backend Online" : "Backend Offline"}
        color={isOnline ? "success" : "error"}
        variant={isOnline ? "outlined" : "filled"}
      />
    </Box>
  );
};

export default HealthStatus;
