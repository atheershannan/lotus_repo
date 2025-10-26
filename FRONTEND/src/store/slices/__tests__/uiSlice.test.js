import { configureStore } from '@reduxjs/toolkit';
import uiSlice, { 
  setTheme, 
  toggleSidebar, 
  setSidebarOpen, 
  addNotification, 
  clearError 
} from '../uiSlice';

describe('uiSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { ui: uiSlice },
    });
  });

  it('should have correct initial state', () => {
    const state = store.getState().ui;
    expect(state.theme).toBe('light');
    expect(state.sidebarOpen).toBe(true);
    expect(state.notifications).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('should handle setTheme', () => {
    store.dispatch(setTheme('dark'));
    const state = store.getState().ui;
    expect(state.theme).toBe('dark');
  });

  it('should handle toggleSidebar', () => {
    const initialState = store.getState().ui.sidebarOpen;
    store.dispatch(toggleSidebar());
    const newState = store.getState().ui.sidebarOpen;
    expect(newState).toBe(!initialState);
  });

  it('should handle setSidebarOpen', () => {
    store.dispatch(setSidebarOpen(false));
    const state = store.getState().ui;
    expect(state.sidebarOpen).toBe(false);

    store.dispatch(setSidebarOpen(true));
    const newState = store.getState().ui;
    expect(newState.sidebarOpen).toBe(true);
  });

  it('should handle addNotification', () => {
    const notification = { type: 'success', message: 'Test notification' };
    store.dispatch(addNotification(notification));
    const state = store.getState().ui;
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]).toMatchObject({
      id: expect.any(Number),
      ...notification,
    });
  });

  it('should handle clearError', () => {
    store.dispatch(clearError());
    const state = store.getState().ui;
    expect(state.error).toBeNull();
  });
});

