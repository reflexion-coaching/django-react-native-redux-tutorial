import { configureStore } from '@reduxjs/toolkit';
import { bookApi } from '../features/api/bookSlice';

export const store = configureStore({
  reducer: {
    [bookApi.reducerPath]: bookApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(bookApi.middleware)
});


