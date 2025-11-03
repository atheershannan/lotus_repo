import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: [],
  currentContent: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setCurrentContent: (state, action) => {
      state.currentContent = action.payload;
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
  setContent, 
  setCurrentContent, 
  setLoading, 
  setError, 
  clearError, 
  updatePagination 
} = contentSlice.actions;

export default contentSlice.reducer;


