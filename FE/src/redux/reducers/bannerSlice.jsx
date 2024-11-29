import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    banners: null,
};

const bannerSlice = createSlice({
    name: "banner",
    initialState,
    reducers: {
        getBannersSuccess(state, action) {
            state.banners = action.payload;
        },
    },
});

export const { getBannersSuccess } = bannerSlice.actions;

export const selectBanners = (state) => state.banner.banners;
export default bannerSlice.reducer;
