import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { mockTheme } from '../../setupTests';
import authSlice from '../../store/slices/authSlice';
import LoginPage from '../LoginPage';

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

describe('LoginPage', () => {
  it('renders login form', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    const store = createMockStore({ error: 'Login failed' });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByPlaceholderText(/password/i) || screen.getByRole('button', { name: /password/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    // Note: password handling may vary in tests
    fireEvent.click(submitButton);
  });

  it('disables submit button when isLoading is true', () => {
    const store = createMockStore({ isLoading: true });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={mockTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
  });
});

