import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { mockTheme } from '../../../setupTests';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <LoadingSpinner />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <LoadingSpinner message="Please wait" />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { container } = render(
      <ThemeProvider theme={mockTheme}>
        <LoadingSpinner size={60} />
      </ThemeProvider>
    );
    
    const spinner = container.querySelector('.MuiCircularProgress-root');
    expect(spinner).toBeInTheDocument();
  });
});

