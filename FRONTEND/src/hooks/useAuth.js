import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCurrentUser, setUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated: authIsAuthenticated, isLoading, error } = useSelector(state => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // If we have a token but no user, fetch user data
        if (!user) {
          try {
            await dispatch(getCurrentUser()).unwrap();
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } else if (!authIsAuthenticated) {
          // If we have user data but not authenticated state, set it
          dispatch(setUser(user));
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch, user, authIsAuthenticated]);

  return {
    user,
    isAuthenticated: authIsAuthenticated || !!localStorage.getItem('accessToken'),
    isLoading: isLoading || isCheckingAuth,
    error
  };
};

export default useAuth;


