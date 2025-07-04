import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const API_URL = '/skills';

const getAuthHeaders = (getState, isJSON = false) => {
    const { auth } = getState();
    const token = auth.userInfo?.token;
    if (!token) {
        return {};
    }
    return {
        headers: {
            ...(isJSON && { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createSkill = createAsyncThunk(
    'skills/create',
    async (skillData, { getState, rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, skillData, getAuthHeaders(getState, true));
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

export const fetchSkills = createAsyncThunk(
    'skills/fetchAll',
    async ({ category, search }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (search) params.append('search', search);

            const res = await axios.get(`${API_URL}?${params.toString()}`);
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch skills';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

export const fetchSkillById = createAsyncThunk(
    'skills/fetchById',
    async (skillId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/${skillId}`);
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

export const fetchInstructorSkills = createAsyncThunk(
    'skills/fetchInstructorSkills',
    async (_, { getState, rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/instructor`, getAuthHeaders(getState));
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load instructor skills';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

export const deleteSkill = createAsyncThunk(
    'skills/delete',
    async (skillId, { getState, rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/${skillId}`, getAuthHeaders(getState));
            toast.success('✅ Skill deleted successfully');
            return skillId;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

export const updateSkill = createAsyncThunk(
    'skills/update',
    async ({ id, skillData }, { getState, rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, skillData, getAuthHeaders(getState, true));
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

const initialState = {
    skills: [],
    skillDetail: null,
    instructorSkills: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
};

const skillSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        clearSkillError: (state) => {
            state.error = null;
        },
        resetSkillDetail: (state) => {
            state.skillDetail = null;
        },
        resetSkills: (state) => {
            state.skills = [];
            state.instructorSkills = [];
            state.skillDetail = null;
            state.loading = false;
            state.error = null;
            state.lastFetchedAt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload.skills || action.payload || [];
                state.lastFetchedAt = Date.now();
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(fetchSkillById.pending, (state) => {
                state.loading = true;
                state.skillDetail = null;
                state.error = null;
            })
            .addCase(fetchSkillById.fulfilled, (state, action) => {
                state.loading = false;
                state.skillDetail = action.payload;
            })
            .addCase(fetchSkillById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(fetchInstructorSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstructorSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.instructorSkills = action.payload;
            })
            .addCase(fetchInstructorSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(createSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                state.loading = false;
                state.skills.unshift(action.payload);
                state.instructorSkills.unshift(action.payload);
                toast.success('✅ Skill created successfully');
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(deleteSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = state.skills.filter(skill => skill._id !== action.payload);
                state.instructorSkills = state.instructorSkills.filter(skill => skill._id !== action.payload);
                if (state.skillDetail && state.skillDetail._id === action.payload) {
                    state.skillDetail = null;
                }
            })
            .addCase(deleteSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(updateSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSkill = action.payload;

                state.skills = state.skills.map(skill => 
                    skill._id === updatedSkill._id ? updatedSkill : skill
                );

                state.instructorSkills = state.instructorSkills.map(skill => 
                    skill._id === updatedSkill._id ? updatedSkill : skill
                );

                if (state.skillDetail && state.skillDetail._id === updatedSkill._id) {
                    state.skillDetail = updatedSkill;
                }
            })
            .addCase(updateSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export const {
    clearSkillError,
    resetSkillDetail,
    resetSkills,
} = skillSlice.actions;

export default skillSlice.reducer;
