import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        getOrdersSuccess(state, action) {
            state.orders = action.payload;
        },
    },
});

export const { getOrdersSuccess } = orderSlice.actions;

export const selectOrders = (state) => state.order.orders;
export default orderSlice.reducer;
