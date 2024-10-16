import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getItemsSuccess(state, action) {
            state.items = action.payload;
            state.error = null;
        },
    },
});

export const { getItemsSuccess } = itemSlice.actions;

export const selectItems = (state) => state.item.items;
export default itemSlice.reducer;
