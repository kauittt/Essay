import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
    user: null,
    totalUsers: [],
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUserSuccess(state, action) {
            state.user = action.payload;
            state.error = null;
        },
        getTotalUsersSuccess(state, action) {
            state.totalUsers = action.payload;
            state.error = null;
        },
        userLogout(state) {
            localStorage.removeItem("user");
            state.user = null;
            state.totalUsers = null;
            state.error = null;
        },
    },
});

export const { getUserSuccess, getTotalUsersSuccess, userLogout } =
    userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectTotalUsers = (state) => state.user.totalUsers;
export default userSlice.reducer;
