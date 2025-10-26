import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import chatSlice from './slices/chatSlice';
import contentSlice from './slices/contentSlice';
import skillsSlice from './slices/skillsSlice';
import progressSlice from './slices/progressSlice';
import searchSlice from './slices/searchSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    content: contentSlice,
    skills: skillsSlice,
    progress: progressSlice,
    search: searchSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


