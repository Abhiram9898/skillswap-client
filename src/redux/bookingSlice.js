import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const API_URL = '/bookings';

const getAuthConfig = (token, isJSON = false) => ({
  headers: {
    ...(isJSON && { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  },
});

// Helper for consistent error formatting
const handleApiError = (error, rejectWithValue) => {
  const msg = error.response?.data?.message || 'Request failed';
  toast.error(msg);
  return rejectWithValue({
    message: msg,
    errors: error.response?.data?.errors,
    status: error.response?.status,
  });
};

// Create Booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(API_URL, bookingData, getAuthConfig(auth.userInfo.token, true));
      toast.success('Booking created');
      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch User Bookings
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/user/${userId}`, getAuthConfig(auth.userInfo.token));
      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch Instructor Bookings
export const fetchInstructorBookings = createAsyncThunk(
  'bookings/fetchInstructor',
  async (instructorId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/instructor/${instructorId}`, getAuthConfig(auth.userInfo.token));
      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch All Bookings
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/admin/all`, getAuthConfig(auth.userInfo.token));
      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Update Booking Status
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ bookingId, status, meetingLink }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.put(
        `${API_URL}/${bookingId}/status`,
        { status, meetingLink },
        getAuthConfig(auth.userInfo.token, true)
      );
      toast.success('Booking status updated');
      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Cancel Booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/${bookingId}`, getAuthConfig(auth.userInfo.token));
      toast.success('Booking canceled');
      return bookingId;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    userBookings: [],
    instructorBookings: [],
    adminBookings: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetBookings: (state) => {
      state.userBookings = [];
      state.instructorBookings = [];
      state.adminBookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings.unshift(action.payload);
        state.lastUpdated = Date.now();
      })

      // Fetches
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchInstructorBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorBookings = action.payload;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBookings = action.payload;
      })

      // Update
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updateBooking = (list) =>
          list.map((b) => (b._id === action.payload._id ? action.payload : b));

        state.userBookings = updateBooking(state.userBookings);
        state.instructorBookings = updateBooking(state.instructorBookings);
        state.adminBookings = updateBooking(state.adminBookings);
        state.lastUpdated = Date.now();
      })

      // Cancel
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const removeBooking = (list) => list.filter((b) => b._id !== action.payload);

        state.userBookings = removeBooking(state.userBookings);
        state.instructorBookings = removeBooking(state.instructorBookings);
        state.adminBookings = removeBooking(state.adminBookings);
        state.lastUpdated = Date.now();
      })

        .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // Errors
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.message ||
            action.error?.message ||
            'Booking operation failed';
        }
      );
  },
});

export const { clearBookingError, resetBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
