import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios'; // Assuming axios is configured correctly for API calls
import { toast } from 'react-toastify'; // For displaying notifications

const API_URL = '/skills'; // Base API URL for skill-related endpoints

// Helper to get auth headers from Redux state
// This ensures that the token is always included for protected routes.
const getAuthHeaders = (getState, isJSON = false) => {
    const { auth } = getState();
    const token = auth.userInfo?.token; // Safely get token
    if (!token) {
        // Optionally throw an error or return null if no token is found,
        // depending on how you want to handle unauthenticated calls to protected endpoints.
        // For now, we'll let the backend handle the 401 if no token is present.
        return {}; // Return empty headers if no token
    }
    return {
        headers: {
            ...(isJSON && { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${token}`,
        },
    };
};

// 🔨 Create a new skill
// This async thunk handles the creation of a new skill by making a POST request to the API.
export const createSkill = createAsyncThunk(
    'skills/create',
    async (skillData, { getState, rejectWithValue }) => {
        try {
            // Pass the authentication headers using the helper
            const response = await axios.post(API_URL, skillData, getAuthHeaders(getState, true));
            // If the request is successful, return the data from the response.
            return response.data;
        } catch (err) {
            // If an error occurs, extract the message from the error response or use a default.
            const msg = err.response?.data?.message || 'Failed to create skill';
            // Display an error toast notification.
            toast.error(msg);
            // Reject the thunk with the error message.
            return rejectWithValue({ message: msg });
        }
    }
);

// 🔁 Fetch all skills with optional filters
// This async thunk fetches a list of skills, allowing for optional category and search filters.
// NOTE: This endpoint might be public, so no auth header is explicitly passed here.
// If it's protected, you'd need to add getAuthHeaders(getState) here too.
export const fetchSkills = createAsyncThunk(
    'skills/fetchAll',
    async ({ category, search }, { rejectWithValue }) => {
        try {
            // Create URLSearchParams to build the query string for filters.
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (search) params.append('search', search);

            // Make a GET request to the API with the constructed query string.
            const res = await axios.get(`${API_URL}?${params.toString()}`);
            // Return the skills data. It might be directly in the payload or an object containing it.
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch skills';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

// 🔁 Fetch a single skill by its ID
// This async thunk fetches details for a specific skill using its ID.
// NOTE: This endpoint might be public, so no auth header is explicitly passed here.
// If it's protected, you'd need to add getAuthHeaders(getState) here too.
export const fetchSkillById = createAsyncThunk(
    'skills/fetchById',
    async (skillId, { rejectWithValue }) => {
        try {
            // Make a GET request to the API for a specific skill ID.
            const res = await axios.get(`${API_URL}/${skillId}`);
            // Return the fetched skill data.
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

// 🔁 Fetch instructor's own skills
// This async thunk fetches skills specifically associated with the authenticated instructor.
export const fetchInstructorSkills = createAsyncThunk(
    'skills/fetchInstructorSkills',
    async (_, { getState, rejectWithValue }) => {
        try {
            // Make a GET request to the instructor-specific skills endpoint with auth headers.
            const res = await axios.get(`${API_URL}/instructor`, getAuthHeaders(getState));
            // Return the instructor's skills data.
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load instructor skills';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

// 🗑️ Delete a skill
export const deleteSkill = createAsyncThunk(
    'skills/delete',
    async (skillId, { getState, rejectWithValue }) => {
        try {
            // Assuming your backend delete endpoint is DELETE /api/skills/:skillId
            const response = await axios.delete(`${API_URL}/${skillId}`, getAuthHeaders(getState));
            toast.success('✅ Skill deleted successfully');
            // Return the ID of the deleted skill to update the state in the reducer
            return skillId;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);

// ✍️ Update a skill (NEWLY ADDED THUNK)
export const updateSkill = createAsyncThunk( // <-- THIS WAS MISSING 'export'
    'skills/update',
    async ({ id, skillData }, { getState, rejectWithValue }) => {
        try {
            // Make a PUT request to update the skill
            const response = await axios.put(`${API_URL}/${id}`, skillData, getAuthHeaders(getState, true));
            // Return the updated skill data
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update skill';
            toast.error(msg);
            return rejectWithValue({ message: msg });
        }
    }
);


// 🧠 Initial Redux State for the skill slice
const initialState = {
    skills: [], // Array to store all fetched skills
    skillDetail: null, // Stores details of a single fetched skill
    instructorSkills: [], // Stores skills specific to the instructor
    loading: false, // Boolean to indicate loading state for API calls
    error: null, // Stores any error messages from API calls
    lastFetchedAt: null, // Timestamp of the last successful fetch operation
};

const skillSlice = createSlice({
    name: 'skills', // Name of the slice, used in Redux DevTools
    initialState, // The initial state defined above
    reducers: {
        // Reducer to clear any existing error messages.
        clearSkillError: (state) => {
            state.error = null;
        },
        // Reducer to reset the skillDetail to null.
        resetSkillDetail: (state) => {
            state.skillDetail = null;
        },
        // Reducer to reset the entire skill slice state to its initial values.
        resetSkills: (state) => {
            state.skills = [];
            state.instructorSkills = [];
            state.skillDetail = null;
            state.loading = false;
            state.error = null;
            state.lastFetchedAt = null;
        },
    },
    // extraReducers handle actions dispatched by createAsyncThunk.
    extraReducers: (builder) => {
        builder
            // --- Handlers for fetchSkills (all skills) ---
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true; // Set loading to true when the fetch starts
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false on success
                // Update the skills array. The payload might be directly the array or an object containing it.
                state.skills = action.payload.skills || action.payload || [];
                state.lastFetchedAt = Date.now(); // Record the time of the successful fetch
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false; // Set loading to false on failure
                state.error = action.payload?.message; // Store the error message
            })

            // --- Handlers for fetchSkillById (single skill) ---
            .addCase(fetchSkillById.pending, (state) => {
                state.loading = true;
                state.skillDetail = null; // Clear previous skill detail while fetching new one
                state.error = null;
            })
            .addCase(fetchSkillById.fulfilled, (state, action) => {
                state.loading = false;
                state.skillDetail = action.payload; // Store the fetched single skill
            })
            .addCase(fetchSkillById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Handlers for fetchInstructorSkills (instructor's skills) ---
            .addCase(fetchInstructorSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstructorSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.instructorSkills = action.payload; // Store the instructor's skills
            })
            .addCase(fetchInstructorSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Handlers for createSkill (creating a new skill) ---
            .addCase(createSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                state.loading = false;
                // Add the newly created skill to the beginning of both skills and instructorSkills arrays.
                state.skills.unshift(action.payload);
                state.instructorSkills.unshift(action.payload);
                toast.success('✅ Skill created successfully'); // Show success notification
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Handlers for deleteSkill (deleting a skill) ---
            .addCase(deleteSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is the skillId that was returned from the thunk
                state.skills = state.skills.filter(skill => skill._id !== action.payload);
                state.instructorSkills = state.instructorSkills.filter(skill => skill._id !== action.payload);
                // If the deleted skill was the one currently in detail view, clear it
                if (state.skillDetail && state.skillDetail._id === action.payload) {
                    state.skillDetail = null;
                }
                // Toast is handled in the thunk itself for success
            })
            .addCase(deleteSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Handlers for updateSkill (updating a skill) --- (NEWLY ADDED)
            .addCase(updateSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.loading = false;
                // Update the skill in all relevant arrays
                const updatedSkill = action.payload;

                // Update in 'skills' array (if present)
                state.skills = state.skills.map(skill => 
                    skill._id === updatedSkill._id ? updatedSkill : skill
                );

                // Update in 'instructorSkills' array (if present)
                state.instructorSkills = state.instructorSkills.map(skill => 
                    skill._id === updatedSkill._id ? updatedSkill : skill
                );

                // If the updated skill is the one currently in detail view, update it
                if (state.skillDetail && state.skillDetail._id === updatedSkill._id) {
                    state.skillDetail = updatedSkill;
                }
                // Toast is handled in the component for success
            })
            .addCase(updateSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

// ✅ Actions generated by createSlice for regular reducers
export const {
    clearSkillError,
    resetSkillDetail,
    resetSkills,
} = skillSlice.actions;

// ✅ Reducer export: This is the default export for the slice's reducer.
export default skillSlice.reducer;
