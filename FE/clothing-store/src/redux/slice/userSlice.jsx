import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    totalUsers: null,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUserSuccess(state, action) {
            return {
                ...state,
                user: action.payload,
                error: null,
            };
        },
        getUserFailed(state, action) {
            return {
                ...state,
                error: action.payload,
            };
        },
        userLogout(state) {
            return {
                ...state,
                error: null,
                user: null,
            };
        },
    },
});

export const {
    getUserSuccess,
    getUserFailed,
    userLogout,
    getTotalUsersSuccess,
    getTotalUsersFailed,
} = userSlice.actions;

export const selectUser = state => state.user.user;
export const selectTotalUsers = state => state.user.totalUsers;
export default userSlice.reducer;
