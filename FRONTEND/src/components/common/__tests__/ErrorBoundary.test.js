import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { mockTheme } from '../../../setupTests';
import uiSlice from '../../../store/slices/uiSlice';
import ErrorBoundary from '../ErrorBoundary';

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

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <ErrorBoundary>
            <div>Test content</div>
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('displays error snackbar when error exists', () => {
    const store = createMockStore({ error: 'Test error message' });
    render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <ErrorBoundary>
            <div>Test content</div>
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
});

