import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  suggestions: [],
  trending: [],
  isLoading: false,
  error: null,
  lastQuery: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setTrending: (state, action) => {
      state.trending = action.payload;
    },
    setLastQuery: (state, action) => {
      state.lastQuery = action.payload;
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
    clearSearch: (state) => {
      state.searchResults = [];
      state.lastQuery = null;
    }
  }
});

export const { 
  setSearchResults, 
  setSuggestions, 
  setTrending, 
  setLastQuery, 
  setLoading, 
  setError, 
  clearError, 
  clearSearch 
} = searchSlice.actions;

export default searchSlice.reducer;


