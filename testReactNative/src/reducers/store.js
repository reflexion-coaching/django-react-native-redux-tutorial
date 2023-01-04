import { configureStore } from '@reduxjs/toolkit';
import { bookApi } from '../features/api/bookSlice';
import authentificationReducer from '../features/api/authentificationSlice'

export const store = configureStore({
  reducer: {
    [bookApi.reducerPath]: bookApi.reducer,
    authentification: authentificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(bookApi.middleware)
});


