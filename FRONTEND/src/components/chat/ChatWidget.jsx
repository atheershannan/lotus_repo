import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '../../context/ChatContext';
import ChatbotUI from './ChatbotUI';
import { useDispatch, useSelector } from 'react-redux';
import { generateUUID } from '../../utils/helpers';

const ChatWidget = () => {
  const { isOpen, closeChat } = useChatContext();
  const dispatch = useDispatch();
  const { currentSessionId } = useSelector(state => state.chat);
  const widgetRef = useRef(null);

  // Generate session ID if none exists
  const sessionId = currentSessionId || generateUUID();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeChat]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        // Check if click is not on the floating button
        const floatingButton = e.target.closest('[data-chat-button]');
        if (!floatingButton && isOpen) {
          closeChat();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeChat]);

  const widgetVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={widgetVariants}
          sx={{
            position: 'fixed',
            bottom: { xs: '88px', sm: '96px' },
            right: { xs: '24px', sm: '24px' },
            left: { xs: '24px', sm: 'auto' },
            zIndex: 999,
            width: { xs: 'calc(100vw - 48px)', sm: '420px' },
            height: { xs: '70vh', sm: '600px' },
            maxHeight: 'calc(100vh - 120px)'
          }}
          ref={widgetRef}
        >
          <Paper
            elevation={24}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '2px solid',
              borderImage: 'var(--gradient-primary) 1',
              boxShadow: 'var(--shadow-card), var(--shadow-glow)',
              '@media (max-width: 600px)': {
                height: '100%'
              }
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--gradient-primary)',
                color: 'white',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    width: 32,
                    height: 32
                  }}
                >
                  <BotIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Learning Assistant
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Ask me anything
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={closeChat}
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Chat Content */}
            <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex' }}>
              <ChatbotUI
                sessionId={sessionId}
                showHeader={false}
                compact={true}
                height="100%"
              />
            </Box>
          </Paper>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
