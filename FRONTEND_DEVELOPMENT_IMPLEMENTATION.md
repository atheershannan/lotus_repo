# 🎨 FRONTEND DEVELOPMENT IMPLEMENTATION

## 🎯 Frontend Development for Corporate Assistant

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Frontend Version**: 1.0
**Date**: December 2024
**Status**: Implementation

---

## 📊 Dynamic Questions Answered

### 1️⃣ UI/UX Preferences
**Corporate Learning Assistant Design:**

- **Design System**: Material-UI with custom corporate theme
- **Color Scheme**: Light theme with corporate branding, dark mode support
- **Responsive Design**: Mobile-first for Slack/Teams integration
- **Accessibility**: WCAG 2.1 AA compliance for enterprise accessibility

### 2️⃣ Component Architecture
**React JavaScript Stack:**

- **Component Library**: React 18 with JavaScript (no TypeScript)
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Styling Approach**: Styled-components with CSS-in-JS
- **Component Organization**: Feature-based with atomic design principles

### 3️⃣ User Experience Flow
**Multi-Platform Chat Interface:**

- **Navigation**: Single page app with chat-focused interface
- **User Onboarding**: Guided tour with progressive disclosure
- **Loading States**: Skeleton screens for RAG processing, typing indicators
- **Error Handling**: Toast notifications with retry mechanisms

### 4️⃣ Real-time Features
**Supabase Integration:**

- **Supabase Integration**: Real-time subscriptions for live updates
- **State Synchronization**: Redux state updates via Supabase subscriptions
- **Conflict Resolution**: Last-write-wins with user notifications
- **Offline Support**: Cached responses with sync indicators

### 5️⃣ Performance Requirements
**Enterprise Performance:**

- **Bundle Size**: <500KB initial bundle, code splitting
- **Load Time**: <2 seconds initial load, <1 second for chat responses
- **Runtime Performance**: 60fps animations, smooth scrolling
- **SEO Requirements**: Client-side rendering with meta tags

---

## 🏗️ Frontend Project Structure

```
FRONTEND/
├── public/
│   ├── index.html
│   ├── chatbot-demo.html          # Chatbot demo page
│   ├── microservice-integration.js # Microservice integration script
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/                # Reusable components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   └── LoadingSpinner/
│   │   ├── chat/                  # Chat-specific components
│   │   │   ├── ChatInterface/
│   │   │   ├── MessageList/
│   │   │   ├── MessageInput/
│   │   │   ├── TypingIndicator/
│   │   │   └── ChatHeader/
│   │   ├── dashboard/             # Dashboard components
│   │   │   ├── LearningProgress/
│   │   │   ├── Recommendations/
│   │   │   ├── SkillTracker/
│   │   │   └── UserProfile/
│   │   └── layout/                # Layout components
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       ├── Footer/
│   │       └── Layout/
│   ├── pages/
│   │   ├── ChatPage/
│   │   ├── DashboardPage/
│   │   ├── ProfilePage/
│   │   └── LoginPage/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useSupabase.js
│   │   └── useRealtime.js
│   ├── store/
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── chatSlice.js
│   │   ├── userSlice.js
│   │   └── api/
│   │       ├── authApi.js
│   │       ├── chatApi.js
│   │       └── userApi.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── api.js
│   │   └── websocket.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── storage.js
│   ├── styles/
│   │   ├── theme.js
│   │   ├── globals.js
│   │   └── components/
│   ├── tests/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── App.js
│   └── index.js
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔧 Frontend Implementation

### 1. Package.json Configuration
```json
{
  "name": "corporate-assistant-frontend",
  "version": "1.0.0",
  "description": "Contextual Corporate Assistant RAG/GRAPH Frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "@mui/material": "^5.14.18",
    "@mui/icons-material": "^5.14.18",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "styled-components": "^6.1.1",
    "@supabase/supabase-js": "^2.38.4",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "framer-motion": "^10.16.16",
    "react-intersection-observer": "^9.5.3",
    "react-virtualized": "^9.22.5",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

### 2. Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mui: ['@mui/material', '@mui/icons-material'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  define: {
    global: 'globalThis'
  }
})
```

### 3. Main App Component
```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { store } from './store';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
```

### 4. Redux Store Configuration
```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authSlice from './authSlice';
import chatSlice from './chatSlice';
import userSlice from './userSlice';
import { authApi } from './api/authApi';
import { chatApi } from './api/chatApi';
import { userApi } from './api/userApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    user: userSlice,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(authApi.middleware)
      .concat(chatApi.middleware)
      .concat(userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5. Chat Interface Component
```javascript
// src/components/chat/ChatInterface/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Send, AttachFile, Mic, MoreVert } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import ChatHeader from '../ChatHeader/ChatHeader';
import { useChat } from '../../../hooks/useChat';
import { useRealtime } from '../../../hooks/useRealtime';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { messages, isLoading, isTyping } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const { sendMessage, clearChat } = useChat();
  const { subscribeToUpdates } = useRealtime();
  
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Subscribe to real-time updates
    subscribeToUpdates();
  }, [subscribeToUpdates]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatHeader onClearChat={clearChat} />
      
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MessageList
                  message={message}
                  isUser={message.sender === 'user'}
                  showAvatar={index === 0 || messages[index - 1].sender !== message.sender}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Ask me anything about learning and development..."
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
```

### 6. Message List Component
```javascript
// src/components/chat/MessageList/MessageList.js
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  ContentCopy,
  Share,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MessageList = ({ message, isUser, showAvatar }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFeedback = (type) => {
    // Handle feedback
    console.log(`Feedback: ${type} for message ${message.id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      {!isUser && showAvatar && (
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 32,
            height: 32,
          }}
        >
          AI
        </Avatar>
      )}
      
      <Paper
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
        }}
        component={motion.div}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          {message.content}
        </Typography>
        
        {message.sources && message.sources.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Sources:
            </Typography>
            {message.sources.map((source, index) => (
              <Chip
                key={index}
                label={source.title}
                size="small"
                sx={{ mr: 0.5, mt: 0.5 }}
                component={Link}
                href={`#${source.id}`}
              />
            ))}
          </Box>
        )}
        
        {message.confidence && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Confidence: {Math.round(message.confidence * 100)}%
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 4,
                bgcolor: 'grey.300',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${message.confidence * 100}%`,
                  height: '100%',
                  bgcolor: message.confidence > 0.8 ? 'success.main' : 
                          message.confidence > 0.6 ? 'warning.main' : 'error.main',
                }}
              />
            </Box>
          </Box>
        )}
        
        {!isUser && (
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
            <Tooltip title="Copy">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small">
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Good response">
              <IconButton size="small" onClick={() => handleFeedback('positive')}>
                <ThumbUp fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Poor response">
              <IconButton size="small" onClick={() => handleFeedback('negative')}>
                <ThumbDown fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
      
      {isUser && showAvatar && (
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {message.userName?.charAt(0) || 'U'}
        </Avatar>
      )}
    </Box>
  );
};

export default MessageList;
```

### 7. Message Input Component
```javascript
// src/components/chat/MessageInput/MessageInput.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Mic,
  EmojiEmotions,
} from '@mui/icons-material';

const MessageInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  placeholder = "Type your message..."
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
  };

  return (
    <Paper
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        borderRadius: 3,
      }}
    >
      <TextField
        multiline
        maxRows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              border: 'none',
            },
          },
        }}
      />
      
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Attach file">
          <IconButton size="small">
            <AttachFile />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Voice message">
          <IconButton
            size="small"
            onClick={handleVoiceRecord}
            color={isRecording ? 'error' : 'default'}
          >
            <Mic />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Emoji">
          <IconButton size="small">
            <EmojiEmotions />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Send">
          <IconButton
            size="small"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            color="primary"
          >
            <Send />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default MessageInput;
```

### 8. Supabase Integration Hook
```javascript
// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabase = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    supabase,
    session,
    loading,
  };
};
```

### 9. Chat Hook
```javascript
// src/hooks/useChat.js
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './useSupabase';
import { addMessage, setLoading, setTyping } from '../store/chatSlice';
import toast from 'react-hot-toast';

export const useChat = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      userName: user?.name || 'User',
    };

    dispatch(addMessage(userMessage));
    dispatch(setTyping(true));

    try {
      const { data, error } = await supabase.functions.invoke('rag-query', {
        body: {
          query: content,
          userId: user?.id,
        },
      });

      if (error) throw error;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        confidence: data.confidence,
        sources: data.sources,
        processingTime: data.processingTime,
      };

      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setTyping(false));
    }
  }, [dispatch, user]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'chat/clearMessages' });
  }, [dispatch]);

  return {
    sendMessage,
    clearChat,
    messages,
  };
};
```

---

## 🌐 Chatbot Demo HTML Page

### 1. Standalone Chatbot Demo
```html
<!-- public/chatbot-demo.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corporate Learning Assistant - Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chatbot-container {
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .chatbot-header h1 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .chatbot-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .chatbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .message.user .message-content {
            background: #667eea;
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .message.ai .message-content {
            background: white;
            color: #333;
            border: 1px solid #e1e5e9;
            border-bottom-left-radius: 4px;
        }
        
        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin: 0 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
        }
        
        .message.user .message-avatar {
            background: #667eea;
            color: white;
        }
        
        .message.ai .message-avatar {
            background: #f0f0f0;
            color: #666;
        }
        
        .chatbot-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e1e5e9;
        }
        
        .input-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .input-field {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e1e5e9;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        
        .input-field:focus {
            border-color: #667eea;
        }
        
        .send-button {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: #667eea;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        
        .send-button:hover {
            background: #5a6fd8;
        }
        
        .send-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            border: 1px solid #e1e5e9;
            margin-bottom: 15px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #667eea;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.5;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
        
        .welcome-message {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .demo-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            font-size: 13px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        // Mock Supabase client for demo
        const mockSupabase = {
            functions: {
                invoke: async (functionName, options) => {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                    
                    const mockResponses = [
                        "I'd be happy to help you with Python programming! Python is a versatile language great for beginners. Would you like to learn about basic syntax, data structures, or specific libraries?",
                        "Machine learning is a fascinating field! It involves training algorithms to make predictions or decisions. I can help you understand concepts like supervised learning, neural networks, or specific ML libraries like scikit-learn.",
                        "Data analysis with Python typically involves libraries like pandas, numpy, and matplotlib. I can guide you through data cleaning, visualization, and statistical analysis techniques.",
                        "Project management skills are crucial for success! I can help you learn about methodologies like Agile, Scrum, or tools like Jira and Trello. What specific aspect interests you most?",
                        "Great question! I can help you understand various learning paths based on your current skills and career goals. Let me know what field you're interested in and I'll suggest a personalized learning plan."
                    ];
                    
                    return {
                        data: {
                            response: mockResponses[Math.floor(Math.random() * mockResponses.length)],
                            confidence: 0.85 + Math.random() * 0.1,
                            sources: [
                                { id: '1', title: 'Python Fundamentals Course', contentType: 'course' },
                                { id: '2', title: 'Machine Learning Basics', contentType: 'tutorial' }
                            ],
                            processingTime: 1200 + Math.random() * 800
                        },
                        error: null
                    };
                }
            }
        };
        
        function ChatbotDemo() {
            const [messages, setMessages] = useState([]);
            const [inputValue, setInputValue] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [isTyping, setIsTyping] = useState(false);
            const messagesEndRef = useRef(null);
            
            useEffect(() => {
                // Add welcome message
                setMessages([{
                    id: '1',
                    content: 'Hello! I\'m your Corporate Learning Assistant. I can help you with courses, skills, assessments, and learning recommendations. What would you like to learn about today?',
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                }]);
            }, []);
            
            useEffect(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, [messages, isTyping]);
            
            const sendMessage = async () => {
                if (!inputValue.trim() || isLoading) return;
                
                const userMessage = {
                    id: Date.now().toString(),
                    content: inputValue,
                    sender: 'user',
                    timestamp: new Date().toISOString()
                };
                
                setMessages(prev => [...prev, userMessage]);
                setInputValue('');
                setIsLoading(true);
                setIsTyping(true);
                
                try {
                    const { data, error } = await mockSupabase.functions.invoke('rag-query', {
                        body: {
                            query: inputValue,
                            userId: 'demo-user'
                        }
                    });
                    
                    if (error) throw error;
                    
                    const aiMessage = {
                        id: (Date.now() + 1).toString(),
                        content: data.response,
                        sender: 'ai',
                        timestamp: new Date().toISOString(),
                        confidence: data.confidence,
                        sources: data.sources
                    };
                    
                    setMessages(prev => [...prev, aiMessage]);
                } catch (error) {
                    console.error('Error:', error);
                    const errorMessage = {
                        id: (Date.now() + 1).toString(),
                        content: 'Sorry, I encountered an error. Please try again.',
                        sender: 'ai',
                        timestamp: new Date().toISOString(),
                        isError: true
                    };
                    setMessages(prev => [...prev, errorMessage]);
                } finally {
                    setIsLoading(false);
                    setIsTyping(false);
                }
            };
            
            const handleKeyPress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            };
            
            return (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h1>🤖 Corporate Learning Assistant</h1>
                        <p>Your AI-powered learning companion</p>
                    </div>
                    
                    <div className="chatbot-messages">
                        <div className="demo-notice">
                            <strong>Demo Mode:</strong> This is a demonstration of the chatbot interface. Responses are simulated for showcase purposes.
                        </div>
                        
                        {messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender}`}>
                                {message.sender === 'ai' && (
                                    <div className="message-avatar">AI</div>
                                )}
                                <div className="message-content">
                                    {message.content}
                                    {message.confidence && (
                                        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                                            Confidence: {Math.round(message.confidence * 100)}%
                                        </div>
                                    )}
                                </div>
                                {message.sender === 'user' && (
                                    <div className="message-avatar">U</div>
                                )}
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="message ai">
                                <div className="message-avatar">AI</div>
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chatbot-input">
                        <div className="input-container">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Ask me anything about learning..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                className="send-button"
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        
        ReactDOM.render(<ChatbotDemo />, document.getElementById('root'));
    </script>
</body>
</html>
```

---

## 🔧 Microservice Integration Script

### 1. Microservice Integration Script
```javascript
// public/microservice-integration.js
/**
 * Corporate Learning Assistant - Microservice Integration Script
 * This script provides integration capabilities for microservices to embed the chatbot
 */

class CorporateLearningAssistant {
  constructor(config = {}) {
    this.config = {
      supabaseUrl: config.supabaseUrl || 'https://your-project.supabase.co',
      supabaseKey: config.supabaseKey || 'your-anon-key',
      userId: config.userId || null,
      theme: config.theme || 'light',
      position: config.position || 'bottom-right',
      ...config
    };
    
    this.isInitialized = false;
    this.isOpen = false;
    this.messages = [];
    this.currentUser = null;
    
    this.init();
  }
  
  async init() {
    try {
      // Load Supabase client
      if (typeof window.supabase === 'undefined') {
        await this.loadSupabase();
      }
      
      this.supabase = window.supabase.createClient(
        this.config.supabaseUrl,
        this.config.supabaseKey
      );
      
      // Create chatbot UI
      this.createChatbotUI();
      
      // Initialize authentication
      await this.initializeAuth();
      
      this.isInitialized = true;
      console.log('Corporate Learning Assistant initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Corporate Learning Assistant:', error);
    }
  }
  
  async loadSupabase() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/main.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  createChatbotUI() {
    // Create chatbot container
    this.chatbotContainer = document.createElement('div');
    this.chatbotContainer.id = 'corporate-learning-assistant';
    this.chatbotContainer.innerHTML = `
      <div class="cla-widget">
        <div class="cla-toggle" onclick="window.corporateLearningAssistant.toggleChat()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
            <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
          </svg>
        </div>
        
        <div class="cla-chat" style="display: none;">
          <div class="cla-header">
            <div class="cla-title">
              <h3>🤖 Learning Assistant</h3>
              <p>Your AI-powered learning companion</p>
            </div>
            <button class="cla-close" onclick="window.corporateLearningAssistant.closeChat()">×</button>
          </div>
          
          <div class="cla-messages">
            <div class="cla-welcome">
              <p>Hello! I'm your Corporate Learning Assistant. How can I help you learn today?</p>
            </div>
          </div>
          
          <div class="cla-input-container">
            <div class="cla-typing" style="display: none;">
              <div class="cla-typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>AI is typing...</span>
            </div>
            
            <div class="cla-input">
              <input type="text" placeholder="Ask me anything about learning..." />
              <button onclick="window.corporateLearningAssistant.sendMessage()">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    this.addStyles();
    
    // Append to body
    document.body.appendChild(this.chatbotContainer);
  }
  
  addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      #corporate-learning-assistant {
        position: fixed;
        ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .cla-widget {
        position: relative;
      }
      
      .cla-toggle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
        color: white;
      }
      
      .cla-toggle:hover {
        transform: scale(1.1);
      }
      
      .cla-chat {
        position: absolute;
        ${this.config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        ${this.config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .cla-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .cla-title h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .cla-title p {
        margin: 5px 0 0 0;
        font-size: 14px;
        opacity: 0.9;
      }
      
      .cla-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .cla-close:hover {
        background-color: rgba(255,255,255,0.2);
      }
      
      .cla-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f8f9fa;
      }
      
      .cla-welcome {
        text-align: center;
        color: #666;
        font-size: 14px;
        margin-bottom: 20px;
        padding: 15px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e1e5e9;
      }
      
      .cla-message {
        margin-bottom: 15px;
        display: flex;
        align-items: flex-start;
      }
      
      .cla-message.user {
        justify-content: flex-end;
      }
      
      .cla-message-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .cla-message.user .cla-message-content {
        background: #667eea;
        color: white;
        border-bottom-right-radius: 4px;
      }
      
      .cla-message.ai .cla-message-content {
        background: white;
        color: #333;
        border: 1px solid #e1e5e9;
        border-bottom-left-radius: 4px;
      }
      
      .cla-input-container {
        padding: 20px;
        background: white;
        border-top: 1px solid #e1e5e9;
      }
      
      .cla-typing {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #666;
        font-size: 14px;
      }
      
      .cla-typing-dots {
        display: flex;
        gap: 4px;
      }
      
      .cla-typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #667eea;
        animation: cla-typing 1.4s infinite ease-in-out;
      }
      
      .cla-typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .cla-typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes cla-typing {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.5;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }
      
      .cla-input {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      
      .cla-input input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #e1e5e9;
        border-radius: 25px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .cla-input input:focus {
        border-color: #667eea;
      }
      
      .cla-input button {
        padding: 12px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .cla-input button:hover {
        background: #5a6fd8;
      }
      
      .cla-input button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      
      @media (max-width: 480px) {
        .cla-chat {
          width: 300px;
          height: 400px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  async initializeAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.currentUser = session?.user || null;
      
      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUser = session?.user || null;
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }
  
  toggleChat() {
    const chatElement = this.chatbotContainer.querySelector('.cla-chat');
    this.isOpen = !this.isOpen;
    chatElement.style.display = this.isOpen ? 'flex' : 'none';
    
    if (this.isOpen) {
      const input = chatElement.querySelector('input');
      input.focus();
    }
  }
  
  closeChat() {
    const chatElement = this.chatbotContainer.querySelector('.cla-chat');
    this.isOpen = false;
    chatElement.style.display = 'none';
  }
  
  async sendMessage() {
    const input = this.chatbotContainer.querySelector('.cla-input input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    this.showTyping();
    
    try {
      // Send to Supabase Edge Function
      const { data, error } = await this.supabase.functions.invoke('rag-query', {
        body: {
          query: message,
          userId: this.currentUser?.id || 'anonymous'
        }
      });
      
      if (error) throw error;
      
      // Add AI response
      this.addMessage(data.response, 'ai', {
        confidence: data.confidence,
        sources: data.sources
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      this.addMessage('Sorry, I encountered an error. Please try again.', 'ai', { isError: true });
    } finally {
      this.hideTyping();
    }
  }
  
  addMessage(content, sender, metadata = {}) {
    const messagesContainer = this.chatbotContainer.querySelector('.cla-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `cla-message ${sender}`;
    
    let messageContent = content;
    if (metadata.confidence) {
      messageContent += `<div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Confidence: ${Math.round(metadata.confidence * 100)}%</div>`;
    }
    
    messageElement.innerHTML = `
      <div class="cla-message-content">
        ${messageContent}
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({
      content,
      sender,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }
  
  showTyping() {
    const typingElement = this.chatbotContainer.querySelector('.cla-typing');
    typingElement.style.display = 'flex';
  }
  
  hideTyping() {
    const typingElement = this.chatbotContainer.querySelector('.cla-typing');
    typingElement.style.display = 'none';
  }
  
  // Public API methods
  async authenticate(userId) {
    this.currentUser = { id: userId };
  }
  
  async setUserProfile(profile) {
    this.userProfile = profile;
  }
  
  destroy() {
    if (this.chatbotContainer) {
      this.chatbotContainer.remove();
    }
  }
}

// Auto-initialize if config is provided
if (window.corporateLearningAssistantConfig) {
  window.corporateLearningAssistant = new CorporateLearningAssistant(window.corporateLearningAssistantConfig);
}

// Export for manual initialization
window.CorporateLearningAssistant = CorporateLearningAssistant;
```

### 2. Integration Instructions
```html
<!-- Integration example -->
<!DOCTYPE html>
<html>
<head>
    <title>Microservice Integration Example</title>
</head>
<body>
    <h1>Your Microservice</h1>
    <p>This page demonstrates how to integrate the Corporate Learning Assistant chatbot.</p>
    
    <!-- Include the integration script -->
    <script>
        // Configuration
        window.corporateLearningAssistantConfig = {
            supabaseUrl: 'https://your-project.supabase.co',
            supabaseKey: 'your-anon-key',
            userId: 'user-123',
            theme: 'light',
            position: 'bottom-right'
        };
    </script>
    <script src="microservice-integration.js"></script>
    
    <!-- Manual initialization example -->
    <script>
        // Alternative: Manual initialization
        // const assistant = new CorporateLearningAssistant({
        //     supabaseUrl: 'https://your-project.supabase.co',
        //     supabaseKey: 'your-anon-key',
        //     userId: 'user-123'
        // });
    </script>
</body>
</html>
```

---

**Document Status**: Implementation
**Last Updated**: December 2024
**Next Review**: Testing and Integration
**Approved By**: [Name and Title]


