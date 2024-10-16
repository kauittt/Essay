import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: null,
    error: null,
};

const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        getItemsSuccess(state, action) {
            state.items = action.payload;
            state.error = null;
        },
        getItemsFailed(state, action) {
            state.error = action.payload;
        },
        setItemError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { getItemsSuccess, getItemsFailed, setItemError } =
    itemSlice.actions;

export const selectItems = (state) => state.item.items;
export const selectItemError = (state) => state.item.error;
export default itemSlice.reducer;
