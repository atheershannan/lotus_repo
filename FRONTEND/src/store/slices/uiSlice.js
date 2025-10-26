import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
  modals: {
    settings: false,
    analytics: false,
    help: false
  },
  loading: {
    global: false,
    chat: false,
    search: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    }
  }
});

export const { 
  setTheme, 
  toggleSidebar, 
  setSidebarOpen, 
  addNotification, 
  removeNotification, 
  clearNotifications, 
  openModal, 
  closeModal, 
  setLoading 
} = uiSlice.actions;

export default uiSlice.reducer;


