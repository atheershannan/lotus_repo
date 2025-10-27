import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  IconButton as MuiIconButton,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Minimize as MinimizeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MinimalChatWidget = () => {
  const [isMinimized, setIsMinimized] = useState(false);
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

  // Focus input when widget opens
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isMinimized]);

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

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        '@media (max-width: 600px)': {
          bottom: '1rem',
          right: '1rem',
          left: '1rem',
          width: 'calc(100vw - 2rem)'
        }
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '360px',
          height: isMinimized ? '56px' : '520px',
          transition: 'height 0.3s ease',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-card), var(--shadow-glow)',
          '@media (max-width: 600px)': {
            width: '100%',
            height: isMinimized ? '56px' : 'calc(100vh - 2rem)',
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
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={handleMinimize}
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
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {isMinimized ? <MinimizeIcon /> : <MinimizeIcon />}
          </IconButton>
        </Box>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease'
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
                        wordBreak: 'break-word',
                        '@keyframes fadeIn': {
                          from: { opacity: 0, transform: 'translateY(10px)' },
                          to: { opacity: 1, transform: 'translateY(0)' }
                        }
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
                        <MuiIconButton
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
                        </MuiIconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </Box>
  );
};

export default MinimalChatWidget;
