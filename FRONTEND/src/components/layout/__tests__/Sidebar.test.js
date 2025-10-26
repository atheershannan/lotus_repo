import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { mockTheme } from '../../../setupTests';
import uiSlice from '../../../store/slices/uiSlice';
import Sidebar from '../Sidebar';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ui: uiSlice,
    },
    preloadedState: {
      ui: {
        theme: 'light',
        sidebarOpen: true,
        notifications: [],
        error: null,
        modals: { settings: false, analytics: false, help: false },
        loading: { global: false, chat: false, search: false },
        ...initialState,
      },
    },
  });
};

describe('Sidebar', () => {
  it('renders the sidebar', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <Sidebar />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Learning Assistant')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <Sidebar />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('shows sidebar when sidebarOpen is true', () => {
    const store = createMockStore({ sidebarOpen: true });
    
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <Sidebar />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    const drawer = container.querySelector('.MuiDrawer-root');
    expect(drawer).toBeInTheDocument();
  });
});

