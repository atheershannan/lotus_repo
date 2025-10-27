import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '../../context/ChatContext';

const CollapsibleChatWidget = () => {
  const { isOpen, toggleChat } = useChatContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Learning Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "🤖 That's interesting! Let me think about that...",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    toggleChat();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 999,
            '@media (max-width: 600px)': {
              bottom: '100px',
              right: '1rem',
              left: '1rem'
            }
          }}
        >
          <Paper
            elevation={24}
            sx={{
              width: '360px',
              height: '520px',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card), var(--shadow-glow)',
              '@media (max-width: 600px)': {
                width: 'calc(100vw - 2rem)',
                height: 'calc(100vh - 120px)',
                maxHeight: '520px'
              }
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'var(--gradient-primary)',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                size="small"
                onClick={handleClose}
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

            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&::-webkit-scrollbar': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.3)'
                  }
                }
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',
                      p: 1.5,
                      borderRadius: '12px',
                      background:
                        message.sender === 'user'
                          ? 'var(--gradient-primary)'
                          : '#ffffff',
                      color: message.sender === 'user' ? 'white' : 'var(--text-primary)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.7rem'
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Divider />

            {/* Input Area */}
            <Box sx={{ p: 2, background: '#ffffff' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                inputRef={inputRef}
                autoComplete="off"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    background: '#f8fafc',
                    '&:hover': {
                      '& fieldset': {
                        borderColor: 'var(--primary-blue)'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: 'var(--primary-blue)'
                      }
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={inputValue.trim() === ''}
                        sx={{
                          color: 'var(--primary-blue)',
                          '&:hover': {
                            background: 'rgba(6, 95, 70, 0.1)'
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.26)'
                          }
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapsibleChatWidget;
