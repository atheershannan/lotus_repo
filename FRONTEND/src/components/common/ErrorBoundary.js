import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../../store/slices/uiSlice';

const ErrorBoundary = ({ children }) => {
  const dispatch = useDispatch();
  const error = useSelector(state => state.ui.error);

  const handleClose = () => {
    dispatch(clearError());
  };

  return (
    <>
      {children}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ErrorBoundary;


