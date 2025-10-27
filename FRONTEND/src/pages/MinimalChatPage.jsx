import React from 'react';
import { Box } from '@mui/material';
import MinimalChatWidget from '../components/chat/MinimalChatWidget';

/**
 * Minimal Chat Page
 * Displays a clean white page with only the chatbot widget in the bottom-right corner
 */
const MinimalChatPage = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Chat Widget - Bottom Right Corner */}
      <MinimalChatWidget />
    </Box>
  );
};

export default MinimalChatPage;
