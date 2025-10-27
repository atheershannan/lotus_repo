import React from 'react';
import { Box } from '@mui/material';
import ChatButton from '../components/chat/ChatButton';
import CollapsibleChatWidget from '../components/chat/CollapsibleChatWidget';

/**
 * Minimal Chat Page
 * Displays a clean white page with only a floating chat button
 * When clicked, opens a collapsible chat widget
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
      {/* Floating Chat Button */}
      <ChatButton />
      
      {/* Collapsible Chat Widget */}
      <CollapsibleChatWidget />
    </Box>
  );
};

export default MinimalChatPage;
