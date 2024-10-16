import CategoryService from "../../services/CategoryService";
import { getCategoriesSuccess } from "../reducers/categorySlice";

export const fetchCategories = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await CategoryService.getCategories(token);
            dispatch(getCategoriesSuccess(response.data));
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

            await dispatch(fetchProducts());

            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateProduct = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await ProductService.putProduct(id, body);
            await dispatch(fetchProducts());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeProduct = (id) => {
    return async (dispatch) => {
        try {
            await ProductService.deleteProduct(id);

            await dispatch(fetchProducts());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
