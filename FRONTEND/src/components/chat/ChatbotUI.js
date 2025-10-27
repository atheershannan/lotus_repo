import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Fade,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, clearSession, provideFeedback } from '../../store/slices/chatSlice';
import { formatDistanceToNow } from 'date-fns';

const ChatbotUI = ({ 
  sessionId, 
  onSessionChange, 
  height = '600px',
  showHeader = true,
  compact = false 
}) => {
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.user); // Optional - for display purposes only
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (!compact) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      await dispatch(sendMessage({
        message,
        sessionId,
        options: {
          matchThreshold: 0.7,
          matchCount: 5
        }
      })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    try {
      await dispatch(provideFeedback({
        messageId,
        feedback,
        comment: ''
      })).unwrap();
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
  };

  const handleClearSession = () => {
    dispatch(clearSession(sessionId));
  };

  const handleRefresh = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.messageType === 'user');
      if (lastUserMessage) {
        setInputMessage(lastUserMessage.content);
        inputRef.current?.focus();
      }
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: compact ? 2 : 3,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Typography variant="h6" component="h2">
              Learning Assistant
            </Typography>
            {user && (
              <Chip 
                label={user.name} 
                size="small" 
                variant="outlined"
                sx={{ color: 'inherit', borderColor: 'currentColor' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh last message">
              <IconButton size="small" onClick={handleRefresh} color="inherit">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear conversation">
              <IconButton size="small" onClick={handleClearSession} color="inherit">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: compact ? 1 : 2,
        bgcolor: 'grey.50'
      }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                display: 'flex', 
                mb: 2,
                justifyContent: message.messageType === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '80%',
                  flexDirection: message.messageType === 'user' ? 'row-reverse' : 'row'
                }}>
                  {/* Avatar */}
                  <Avatar sx={{ 
                    bgcolor: message.messageType === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}>
                    {message.messageType === 'user' ? <PersonIcon /> : <BotIcon />}
                  </Avatar>

                  {/* Message Content */}
                  <Box sx={{ 
                    bgcolor: message.messageType === 'user' ? 'primary.main' : 'white',
                    color: message.messageType === 'user' ? 'primary.contrastText' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    position: 'relative'
                  }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>

                    {/* Message Metadata */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mt: 1,
                      justifyContent: 'space-between'
                    }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </Typography>

                      {/* Assistant Message Features */}
                      {message.messageType === 'assistant' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* Confidence Score */}
                          {message.confidenceScore && (
                            <Chip
                              label={getConfidenceLabel(message.confidenceScore)}
                              size="small"
                              color={getConfidenceColor(message.confidenceScore)}
                              variant="outlined"
                            />
                          )}

                          {/* Response Time */}
                          {message.responseTimeMs && (
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              {message.responseTimeMs}ms
                            </Typography>
                          )}

                          {/* Feedback Buttons */}
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Helpful">
                              <IconButton 
                                size="small" 
                                onClick={() => handleFeedback(message.id, 'helpful')}
                                color="success"
                              >
                                <ThumbUpIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Not helpful">
                              <IconButton 
                                size="small" 
                                onClick={() => handleFeedback(message.id, 'not_helpful')}
                                color="error"
                              >
                                <ThumbDownIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          Sources:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {message.sources.map((source, idx) => (
                            <Chip
                              key={idx}
                              label={`${source.type} (${Math.round(source.similarity * 100)}%)`}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <Fade in={isTyping}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              opacity: 0.7
            }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <BotIcon />
              </Avatar>
              <Box sx={{ 
                bgcolor: 'white', 
                p: 2, 
                borderRadius: 2, 
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CircularProgress size={16} />
                <Typography variant="body2">Assistant is thinking...</Typography>
              </Box>
            </Box>
          </Fade>
        )}

        {/* Error Message */}
        {error && (
          <Box sx={{ 
            bgcolor: 'error.light', 
            color: 'error.contrastText', 
            p: 2, 
            borderRadius: 2, 
            mb: 2 
          }}>
            <Typography variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: compact ? 1 : 2, 
        borderTop: 1, 
        borderColor: 'divider',
        bgcolor: 'white'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Ask me anything about learning..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'grey.300'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        
        {/* Quick Actions */}
        {!compact && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mt: 1, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              'What skills should I learn?',
              'Show me beginner courses',
              'How do I improve my JavaScript?',
              'What are my learning gaps?'
            ].map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                variant="outlined"
                onClick={() => setInputMessage(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ChatbotUI;


