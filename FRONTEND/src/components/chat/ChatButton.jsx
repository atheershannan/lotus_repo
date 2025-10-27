import React from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useChatContext } from '../../context/ChatContext';

const ChatButton = () => {
  const { toggleChat, isOpen } = useChatContext();

  if (isOpen) {
    return null; // Hide button when chat is open
  }

  return (
    <Tooltip title="Open Learning Assistant" placement="left">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={toggleChat}
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'var(--gradient-primary)',
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            color: 'white',
            boxShadow: 'var(--shadow-glow)',
            '&:hover': {
              boxShadow: 'var(--shadow-hover)',
              background: 'linear-gradient(135deg, #047857 0%, #0f766e 100%)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            '@media (max-width: 600px)': {
              width: 56,
              height: 56,
            }
          }}
        >
          <MessageIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </motion.div>
    </Tooltip>
  );
};

export default ChatButton;
