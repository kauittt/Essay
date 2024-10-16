import ProductService from "../../services/ItemService";
import { getProductsSuccess } from "../reducers/itemSlice";

let accessToken = JSON.parse(localStorage.getItem("accessToken"));

export const fetchProducts = (paraToken) => {
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await ProductService.getProducts(token);

            dispatch(getProductsSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const addProduct = (body) => {
    return async (dispatch) => {
        try {
            const response = await ProductService.postProduct(body);

            await dispatch(fetchItems());

            return response;
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};

export const updateProduct = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await ProductService.putProduct(id, body);
            await dispatch(fetchItems());
            return response;
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};

export const removeProduct = (id) => {
    return async (dispatch) => {
        try {
            await ProductService.deleteProduct(id);

            await dispatch(fetchItems());
            return "OK";
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};
