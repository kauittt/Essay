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

export const { getCategoriesSuccess } = categorySlice.actions;

export const selectCategories = (state) => state.category.categories;
export default categorySlice.reducer;
