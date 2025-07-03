import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { logout } from './authSlice'; // ✅ Clear state on logout

const API_URL = '/reviews';

const authHeader = (token, isJSON = false) => ({
  headers: {
    ...(isJSON && { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  },
});

// 🔁 Add or update a review
export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(API_URL, reviewData, authHeader(auth.userInfo.token, true));
      toast.success('Review submitted');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
      return rejectWithValue(err.response?.data || { message: msg });
    }
  }
);

// 🔁 Fetch reviews by skillId
export const fetchSkillReviews = createAsyncThunk(
  'reviews/fetchSkillReviews',
  async (skillId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${skillId}`);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load reviews';
      toast.error(msg);
      return rejectWithValue(err.response?.data || { message: msg });
    }
  }
);

// 📦 Initial state
const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
  averageRating: null,
  lastReviewAt: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviewState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Add/Update Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newReview = action.payload;
        const existingIndex = state.reviews.findIndex(
          (r) => r.userId._id === newReview.userId._id || r.userId === newReview.userId
        );

        if (existingIndex !== -1) {
          state.reviews[existingIndex] = newReview;
        } else {
          state.reviews.unshift(newReview);
        }

        // Optional update timestamp and average
        state.lastReviewAt = new Date().getTime();
        const sum = state.reviews.reduce((acc, r) => acc + r.rating, 0);
        state.averageRating = (sum / state.reviews.length).toFixed(1);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Review submission failed';
      })

      // 📥 Fetch Reviews
      .addCase(fetchSkillReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSkillReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;

        // Update averageRating
        const total = action.payload.reduce((acc, r) => acc + r.rating, 0);
        state.averageRating = action.payload.length
          ? (total / action.payload.length).toFixed(1)
          : null;

        state.lastReviewAt = action.payload.length
          ? new Date(action.payload[0].createdAt).getTime()
          : null;
      })
      .addCase(fetchSkillReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading reviews';
      })

      // 🔐 Clear reviews on logout
      .addCase(logout, () => initialState);
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
