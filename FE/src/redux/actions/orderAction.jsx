import OrderService from "../../services/OrderService";
import { getOrdersSuccess } from "../reducers/orderSlice";

export const fetchOrders = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await OrderService.getOrders(token);
            console.log("Có response", response.data);
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
