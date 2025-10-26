import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '../../services/api';

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId, options = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(message, sessionId, options);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatHistory(sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get chat history');
    }
  }
);

export const getChatSessions = createAsyncThunk(
  'chat/getChatSessions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatSessions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get chat sessions');
    }
  }
);

export const deleteChatSession = createAsyncThunk(
  'chat/deleteChatSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.deleteChatSession(sessionId);
      return { sessionId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete chat session');
    }
  }
);

export const provideFeedback = createAsyncThunk(
  'chat/provideFeedback',
  async ({ messageId, feedback, comment }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.provideFeedback(messageId, feedback, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to provide feedback');
    }
  }
);

export const getChatAnalytics = createAsyncThunk(
  'chat/getChatAnalytics',
  async (period = '30d', { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatAnalytics(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get chat analytics');
    }
  }
);

const initialState = {
  messages: [],
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
  analytics: null,
  feedback: {},
  lastMessageId: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSession: (state, action) => {
      const sessionId = action.payload;
      state.messages = state.messages.filter(msg => msg.sessionId !== sessionId);
      if (state.currentSessionId === sessionId) {
        state.currentSessionId = null;
      }
    },
    clearAllMessages: (state) => {
      state.messages = [];
      state.currentSessionId = null;
    },
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
      }
    },
    setFeedback: (state, action) => {
      const { messageId, feedback } = action.payload;
      state.feedback[messageId] = feedback;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userMessage, assistantResponse, sessionId } = action.payload;
        
        // Add user message
        state.messages.push({
          id: userMessage.id,
          messageType: 'user',
          content: userMessage.content,
          createdAt: userMessage.timestamp,
          sessionId
        });

        // Add assistant response
        state.messages.push({
          id: assistantResponse.id || `assistant_${Date.now()}`,
          messageType: 'assistant',
          content: assistantResponse.content,
          confidenceScore: assistantResponse.confidence,
          responseTimeMs: assistantResponse.responseTime,
          sources: assistantResponse.sources,
          createdAt: new Date().toISOString(),
          sessionId
        });

        state.currentSessionId = sessionId;
        state.lastMessageId = assistantResponse.id || `assistant_${Date.now()}`;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Chat History
      .addCase(getChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, sessionId } = action.payload;
        state.messages = messages;
        state.currentSessionId = sessionId;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Chat Sessions
      .addCase(getChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload.sessions;
      })
      .addCase(getChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Chat Session
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        const { sessionId } = action.payload;
        state.sessions = state.sessions.filter(session => session.sessionId !== sessionId);
        state.messages = state.messages.filter(msg => msg.sessionId !== sessionId);
        if (state.currentSessionId === sessionId) {
          state.currentSessionId = null;
        }
      })

      // Provide Feedback
      .addCase(provideFeedback.fulfilled, (state, action) => {
        const { messageId, feedback } = action.payload;
        state.feedback[messageId] = feedback;
        
        // Update message metadata
        const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
          state.messages[messageIndex].feedback = feedback;
        }
      })

      // Get Chat Analytics
      .addCase(getChatAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  }
});

export const {
  clearError,
  clearSession,
  clearAllMessages,
  setCurrentSession,
  addMessage,
  updateMessage,
  setFeedback
} = chatSlice.actions;

export default chatSlice.reducer;


