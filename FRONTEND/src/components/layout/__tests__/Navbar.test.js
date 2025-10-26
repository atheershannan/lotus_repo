import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { mockTheme } from '../../../setupTests';
import authSlice from '../../../store/slices/authSlice';
import Navbar from '../Navbar';

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

describe('Navbar', () => {
  it('renders the navbar with title', () => {
    const store = createMockStore({ 
      user: { id: 1, name: 'Test User', email: 'test@example.com' }
    });
    
    render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <Navbar />
        </ThemeProvider>
      </Provider>
    );
    
    expect(screen.getByText('Corporate Learning Assistant')).toBeInTheDocument();
  });

  it('displays user name when user is present', () => {
    const store = createMockStore({ 
      user: { id: 1, name: 'John Doe', email: 'john@example.com' }
    });
    
    render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <Navbar />
        </ThemeProvider>
      </Provider>
    );
    
    expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
  });

  it('opens menu when avatar is clicked', () => {
    const store = createMockStore({ 
      user: { id: 1, name: 'Test User', email: 'test@example.com' }
    });
    
    render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <Navbar />
        </ThemeProvider>
      </Provider>
    );
    
    const avatarButton = screen.getByLabelText(/account of current user/i);
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});

