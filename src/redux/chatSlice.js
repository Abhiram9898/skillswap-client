import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { logout } from './authSlice';

const API_URL = '/messages';

const authHeader = (token, isFormData = false) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return { headers };
};

// Fetch messages by booking
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const res = await axios.get(`${API_URL}/${bookingId}`, authHeader(auth.userInfo.token));
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch messages');
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch messages' });
        }
    }
);

// Send message (text + optional file)
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ bookingId, message, file }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();

            let payload;
            let headers;

            if (file) {
                payload = new FormData();
                payload.append('bookingId', bookingId);
                payload.append('message', message);
                payload.append('attachment', file);
                headers = authHeader(auth.userInfo.token, true);
            } else {
                payload = { bookingId, message };
                headers = authHeader(auth.userInfo.token);
            }

            const res = await axios.post(API_URL, payload, headers);
            toast.success('Message sent');
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message');
            return rejectWithValue(err.response?.data || { message: 'Failed to send message' });
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        loadingMessages: false,
        sendingMessage: false,
        error: null,
        lastMessageAt: null,
        messageStatus: null,
    },
    reducers: {
        addMessage: (state, action) => {
            const newMessage = {
                ...action.payload,
                sender: {
                    _id: action.payload.sender?._id || action.payload.senderId,
                    name: action.payload.sender?.name || 
                         (action.payload.sender?.role === 'instructor' ? 'Instructor' : 'Student'),
                    role: action.payload.sender?.role || 'student',
                    avatar: action.payload.sender?.avatar
                }
            };
            state.messages.push(newMessage);
            state.lastMessageAt = Date.now();
            state.messageStatus = action.payload.status || 'sent';
        },
        clearMessages: (state) => {
            state.messages = [];
            state.lastMessageAt = null;
            state.messageStatus = null;
            state.error = null;
        },
        updateSenderInfo: (state, action) => {
            const { userId, name, role, avatar } = action.payload;
            state.messages = state.messages.map(msg => {
                if ((msg.sender?._id === userId) || (msg.senderId === userId)) {
                    return {
                        ...msg,
                        sender: {
                            _id: userId,
                            name: name || msg.sender?.name,
                            role: role || msg.sender?.role || 'student',
                            avatar: avatar || msg.sender?.avatar
                        }
                    };
                }
                return msg;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loadingMessages = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loadingMessages = false;
                state.messages = action.payload.map(msg => ({
                    ...msg,
                    sender: {
                        _id: msg.sender?._id || msg.senderId,
                        name: msg.sender?.name || 
                             (msg.sender?.role === 'instructor' ? 'Instructor' : 'Student'),
                        role: msg.sender?.role || 'student',
                        avatar: msg.sender?.avatar
                    }
                }));
                state.lastMessageAt = action.payload.length
                    ? new Date(action.payload[action.payload.length - 1].createdAt).getTime()
                    : null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loadingMessages = false;
                state.error = action.payload?.message || 'Unable to fetch messages';
            })
            .addCase(sendMessage.pending, (state) => {
                state.sendingMessage = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sendingMessage = false;
                const newMessage = {
                    ...action.payload,
                    sender: {
                        _id: action.payload.sender?._id || action.payload.senderId,
                        name: action.payload.sender?.name || 
                             (action.payload.sender?.role === 'instructor' ? 'Instructor' : 'Student'),
                        role: action.payload.sender?.role || 'student',
                        avatar: action.payload.sender?.avatar
                    }
                };
                state.messages.push(newMessage);
                state.lastMessageAt = new Date(action.payload.createdAt).getTime();
                state.messageStatus = action.payload.status || 'sent';
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendingMessage = false;
                state.error = action.payload?.message || 'Unable to send message';
            })
            .addCase(logout, (state) => {
                state.messages = [];
                state.loadingMessages = false;
                state.sendingMessage = false;
                state.error = null;
                state.lastMessageAt = null;
                state.messageStatus = null;
            });
    },
});

export const { addMessage, clearMessages, updateSenderInfo } = chatSlice.actions;
export default chatSlice.reducer;