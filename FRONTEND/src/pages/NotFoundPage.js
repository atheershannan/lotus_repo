import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3
      }}
    >
      <Typography variant="h1" component="h1" color="primary">
        404
      </Typography>
      <Typography variant="h4" component="h2">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={() => navigate('/')}
        size="large"
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;


