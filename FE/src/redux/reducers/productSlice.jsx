import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
    products: [],
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProductsSuccess(state, action) {
            state.products = action.payload;
        },
    },
});

export const { getProductsSuccess } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export default productSlice.reducer;
