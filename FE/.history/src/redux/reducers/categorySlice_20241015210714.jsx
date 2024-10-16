import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        getCategoriesSuccess(state, action) {
            state.categories = action.payload;
        },
    },
});

export const { getProductsSuccess } = categorySlice.actions;

export const selectProducts = (state) => state.product.products;
export default categorySlice.reducer;
