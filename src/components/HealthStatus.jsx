// src/components/HealthStatus.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function HealthStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get(`${API_BASE_URL}${API_ENDPOINTS.health}`);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  const statusColor = isOnline ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '4px 8px', borderRadius: 2, bgcolor: 'action.hover' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {isOnline ? 'API Online' : 'API Offline'}
      </Typography>
    </Box>
  );
}

export default HealthStatus;