import { configureStore } from '@reduxjs/toolkit';
import authSlice, { clearError } from '../authSlice';

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authSlice },
    });
  });

  it('should have correct initial state', () => {
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store.dispatch(clearError());
    const state = store.getState().auth;
    expect(state.error).toBeNull();
  });

  it('should handle setUser', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    
    // Test the initial state
    const initialState = store.getState().auth;
    expect(initialState.user).toBeNull();
    
    // Action creator exists
    const { setUser } = authSlice.actions;
    expect(typeof setUser).toBe('function');
    
    // Dispatch the action
    store.dispatch(setUser(mockUser));
    const newState = store.getState().auth;
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
  });
});

