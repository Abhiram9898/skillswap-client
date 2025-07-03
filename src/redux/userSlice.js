import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { logout } from './authSlice'; // to clear user info on logout

const API_URL = '/users';

const authHeaders = (token, isJSON = false) => ({
  headers: {
    ...(isJSON && { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  },
});

// 🔁 Get single user
export const getUserDetails = createAsyncThunk(
  'user/getDetails',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/${userId}`, authHeaders(auth.userInfo.token));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch user';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// 🔁 Update profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.put(
        `${API_URL}/${userData._id}`,
        userData,
        authHeaders(auth.userInfo.token, true)
      );

      // Optional: update logged-in user info in localStorage
      if (auth.userInfo._id === userData._id) {
        const updated = { ...auth.userInfo, ...res.data };
        localStorage.setItem('userInfo', JSON.stringify(updated));
      }

      toast.success('Profile updated');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// 🔁 Admin: Get all users
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(API_URL, authHeaders(auth.userInfo.token));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch users';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// 🔁 Admin: Get stats
export const getUserStats = createAsyncThunk(
  'user/getStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/stats`, authHeaders(auth.userInfo.token));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch stats';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

const initialState = {
  user: null,          // viewed profile
  users: [],           // admin
  stats: null,         // admin
  loading: false,
  error: null,
  success: false,
  lastFetchedAt: null, // optional timestamp for caching
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 🧑‍💼 Get User
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ✏️ Update
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // 📋 Admin: All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // 📈 Admin: Stats
      .addCase(getUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // 🚪 On logout: reset user-related state
      .addCase(logout, () => initialState);
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
