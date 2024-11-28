import OrderService from "../../services/OrderService";
import { getOrdersSuccess } from "../reducers/orderSlice";
import { fetchCurrentUser } from "./userAction";

export const fetchOrders = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await OrderService.getOrders(token);
            dispatch(getOrdersSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const addOrder = (body) => {
    return async (dispatch) => {
        try {
            const response = await OrderService.postOrder(body);
            await dispatch(fetchOrders());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateOrder = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await OrderService.putOrder(id, body);
            await dispatch(fetchOrders());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateCurrentUserOrder = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await OrderService.putCurrentUserOrder(id, body);
            await dispatch(fetchCurrentUser());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeOrder = (id) => {
    return async (dispatch) => {
        try {
            await OrderService.deleteOrder(id);
            await dispatch(fetchOrders());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};

export const removeCurrentUserOrder = (id) => {
    return async (dispatch) => {
        try {
            await OrderService.deleteCurrentUserOrder(id);
            await dispatch(fetchCurrentUser());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
