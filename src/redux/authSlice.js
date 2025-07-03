import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const API_URL = '/auth';

// ✅ Set Auth Header globally
const setAuthToken = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// ✅ If user exists on reload, set auth header
const storedUser = localStorage.getItem('userInfo');
if (storedUser) {
  const { token } = JSON.parse(storedUser);
  if (token) setAuthToken(token);
}

// ✅ Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setAuthToken(res.data.token);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      return rejectWithValue(err.response?.data || { message: msg });
    }
  }
);

// ✅ Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setAuthToken(res.data.token);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      return rejectWithValue(err.response?.data || { message: msg });
    }
  }
);

// ✅ Verify Token
export const verifyToken = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/me`);
      return res.data;
    } catch (err) {
      localStorage.removeItem('userInfo');
      return rejectWithValue(err.response?.data || { message: 'Session expired' });
    }
  }
);

// ✅ Optional: Refresh Token
export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/refresh-token`);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setAuthToken(res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Token refresh failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: null,
    tokenExpired: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      delete axios.defaults.headers.common['Authorization'];
      state.userInfo = null;
      state.error = null;
      state.tokenExpired = false;
      toast.info('Logged out');
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokenExpired: (state, action) => {
      state.tokenExpired = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.tokenExpired = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.tokenExpired = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.tokenExpired = false;

        // ✅ Optional: if your backend returns updated token in `/me`
        if (action.payload.token) {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
          setAuthToken(action.payload.token);
        }
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.tokenExpired = true;
      })

      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.tokenExpired = false;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.tokenExpired = true;
      });
  },
});

export const { logout, clearError, setTokenExpired } = authSlice.actions;
export default authSlice.reducer;
