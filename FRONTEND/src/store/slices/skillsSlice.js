import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  skills: [],
  currentSkill: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    setCurrentSkill: (state, action) => {
      state.currentSkill = action.payload;
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
  setSkills, 
  setCurrentSkill, 
  setLoading, 
  setError, 
  clearError, 
  updatePagination 
} = skillsSlice.actions;

export default skillsSlice.reducer;


