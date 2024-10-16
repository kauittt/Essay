import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProductsSuccess(state, action) {
            state.items = action.payload;
            state.error = null;
        },
    },
});

export const { getItemsSuccess } = itemSlice.actions;

export const selectProducts = (state) => state.product.products;
export default productSlice.reducer;
