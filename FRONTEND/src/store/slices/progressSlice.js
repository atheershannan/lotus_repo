import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progress: [],
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  }
});

export const { 
  setProgress, 
  setStats, 
  setLoading, 
  setError, 
  clearError, 
  updatePagination 
} = progressSlice.actions;

export default progressSlice.reducer;


