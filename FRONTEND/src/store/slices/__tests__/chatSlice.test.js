import { configureStore } from '@reduxjs/toolkit';
import chatSlice, { 
  clearError, 
  clearAllMessages, 
  setCurrentSession, 
  addMessage,
  setFeedback 
} from '../chatSlice';

describe('chatSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { chat: chatSlice },
    });
  });

  it('should have correct initial state', () => {
    const state = store.getState().chat;
    expect(state.messages).toEqual([]);
    expect(state.sessions).toEqual([]);
    expect(state.currentSessionId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store.dispatch(clearError());
    const state = store.getState().chat;
    expect(state.error).toBeNull();
  });

  it('should handle clearAllMessages', () => {
    store.dispatch(clearAllMessages());
    const state = store.getState().chat;
    expect(state.messages).toEqual([]);
    expect(state.currentSessionId).toBeNull();
  });

  it('should handle setCurrentSession', () => {
    const sessionId = 'test-session-123';
    store.dispatch(setCurrentSession(sessionId));
    const state = store.getState().chat;
    expect(state.currentSessionId).toBe(sessionId);
  });

  it('should handle addMessage', () => {
    const message = {
      id: 'msg-1',
      messageType: 'user',
      content: 'Hello',
      sessionId: 'session-1',
      createdAt: new Date().toISOString(),
    };
    
    store.dispatch(addMessage(message));
    const state = store.getState().chat;
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(message);
  });

  it('should handle setFeedback', () => {
    const feedback = { messageId: 'msg-1', feedback: { rating: 'positive', comment: 'Great!' } };
    store.dispatch(setFeedback(feedback));
    const state = store.getState().chat;
    expect(state.feedback['msg-1']).toEqual(feedback.feedback);
  });
});

