import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { mockTheme } from '../../../setupTests';
import { ThemeProvider } from '@mui/material/styles';
import authSlice from '../../../store/slices/authSlice';
import ProtectedRoute from '../ProtectedRoute';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    const store = createMockStore({ 
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com' }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  it('shows loading when isLoading is true', () => {
    const store = createMockStore({ isLoading: true });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  it('redirects to login when not authenticated', () => {
    const store = createMockStore({ 
      isAuthenticated: false,
      isLoading: false
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <ThemeProvider theme={mockTheme}>
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

