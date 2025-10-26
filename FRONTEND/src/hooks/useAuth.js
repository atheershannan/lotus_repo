import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error
  };
};

export default useAuth;


