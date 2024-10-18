import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vouchers: null,
};

const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        getVouchersSuccess(state, action) {
            state.vouchers = action.payload;
        },
    },
});

export const { getVouchersSuccess } = voucherSlice.actions;

export const selectVouchers = (state) => state.voucher.vouchers;
export default voucherSlice.reducer;
