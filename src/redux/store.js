import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import skillReducer from './skillSlice';
import bookingReducer from './bookingSlice';
import reviewReducer from './reviewSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    skills: skillReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
