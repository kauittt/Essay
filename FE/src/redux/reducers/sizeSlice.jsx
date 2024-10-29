import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sizes: ["S", "L", "XL"],
};

const sizeSlice = createSlice({
    name: "size",
    initialState,
    reducers: {},
});

export const {} = sizeSlice.actions;

export const selectSizes = (state) => state.size.sizes;
export default sizeSlice.reducer;
