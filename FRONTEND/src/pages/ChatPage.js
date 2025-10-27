import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Chat as ChatIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  SmartToy as BotIcon,
  TrendingUp as TrendingUpIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

import ChatbotUI from '../components/chat/ChatbotUI';
import { 
  getChatSessions, 
  getChatHistory, 
  deleteChatSession,
  getChatAnalytics,
  clearSession 
} from '../store/slices/chatSlice';
import { generateUUID } from '../utils/helpers';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { 
    messages, 
    sessions, 
    currentSessionId, 
    isLoading, 
    error, 
    analytics 
  } = useSelector(state => state.chat);
  
  const user = useSelector(state => state.auth.user); // Optional - for display purposes only
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Generate new session ID if none exists
  const sessionId = currentSessionId || generateUUID();

  useEffect(() => {
    // Load chat sessions
    dispatch(getChatSessions());
    
    // Load analytics
    dispatch(getChatAnalytics('30d'));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSessionSelect = async (session) => {
    setSelectedSession(session);
    setActiveTab(0); // Switch to chat tab
    
    try {
      await dispatch(getChatHistory(session.sessionId)).unwrap();
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await dispatch(deleteChatSession(sessionId)).unwrap();
      if (selectedSession?.sessionId === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleClearCurrentSession = () => {
    dispatch(clearSession(sessionId));
    setSelectedSession(null);
  };

  const getSessionStats = (session) => {
    const sessionMessages = messages.filter(msg => msg.sessionId === session.sessionId);
    const userMessages = sessionMessages.filter(msg => msg.messageType === 'user');
    const assistantMessages = sessionMessages.filter(msg => msg.messageType === 'assistant');
    
    return {
      totalMessages: sessionMessages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      lastActivity: session.createdAt
    };
  };

  const getAnalyticsSummary = () => {
    if (!analytics) return null;

    return {
      totalMessages: analytics.totalMessages,
      avgConfidence: analytics.avgConfidence,
      avgResponseTime: analytics.avgResponseTime,
      breakdown: analytics.breakdown
    };
  };

  const analyticsSummary = getAnalyticsSummary();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BotIcon color="primary" />
          <Typography variant="h4" component="h1">
            Learning Assistant Chat
          </Typography>
          {user && (
            <Chip 
              label={`Welcome, ${user.name}`} 
              color="primary" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Analytics">
            <IconButton onClick={() => setShowAnalytics(true)}>
              <AnalyticsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        {/* Sidebar */}
        <Paper sx={{ 
          width: 300, 
          borderRight: 1, 
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            orientation="vertical"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<ChatIcon />} 
              label="Chat" 
              iconPosition="start"
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="History" 
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />}
                    onClick={handleClearCurrentSession}
                    size="small"
                  >
                    New Conversation
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<TrendingUpIcon />}
                    onClick={() => setShowAnalytics(true)}
                    size="small"
                  >
                    View Analytics
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
                  Chat History
                </Typography>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <List dense>
                    {sessions.map((session) => {
                      const stats = getSessionStats(session);
                      return (
                        <motion.div
                          key={session.sessionId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card 
                            sx={{ 
                              mb: 1, 
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                            onClick={() => handleSessionSelect(session)}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Typography variant="subtitle2" noWrap>
                                {session.lastMessage || 'New conversation'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={`${stats.totalMessages} messages`} 
                                  size="small" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={session.lastMessageType} 
                                  size="small" 
                                  color="primary"
                                />
                              </Box>
                            </CardContent>
                            <CardActions sx={{ p: 1, pt: 0 }}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.sessionId);
                                }}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </List>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}
          
          <ChatbotUI 
            sessionId={sessionId}
            height="calc(100vh - 120px)"
            showHeader={false}
            compact={false}
          />
        </Box>
      </Box>

      {/* Analytics Dialog */}
      <Dialog 
        open={showAnalytics} 
        onClose={() => setShowAnalytics(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon />
            Chat Analytics
          </Box>
        </DialogTitle>
        <DialogContent>
          {analyticsSummary ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {analyticsSummary.totalMessages}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Messages
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="success.main">
                        {analyticsSummary.avgConfidence}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Confidence
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="info.main">
                        {analyticsSummary.avgResponseTime}ms
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Response Time
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="h6">Message Breakdown</Typography>
              {analyticsSummary.breakdown.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {item.messageType === 'user' ? 'User Messages' : 'Assistant Messages'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.count} messages
                    </Typography>
                    {item.avgConfidence && (
                      <Chip 
                        label={`${item.avgConfidence}% confidence`} 
                        size="small" 
                        color="success"
                      />
                    )}
                    {item.avgResponseTime && (
                      <Chip 
                        label={`${item.avgResponseTime}ms`} 
                        size="small" 
                        color="info"
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalytics(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            Chat Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Chat settings and preferences will be available here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatPage;


