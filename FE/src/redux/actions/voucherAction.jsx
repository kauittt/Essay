import VoucherService from "../../services/VoucherService";
import { getVouchersSuccess } from "../reducers/voucherSlice";

export const fetchVouchers = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await VoucherService.getVouchers(token);
            dispatch(getVouchersSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const addVoucher = (body) => {
    return async (dispatch) => {
        try {
            const response = await VoucherService.postVoucher(body);
            await dispatch(fetchVouchers());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateVoucher = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await VoucherService.putVoucher(id, body);
            await dispatch(fetchVouchers());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeVoucher = (id) => {
    return async (dispatch) => {
        try {
            await VoucherService.deleteVoucher(id);
            await dispatch(fetchVouchers());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
