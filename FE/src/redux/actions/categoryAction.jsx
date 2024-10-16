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

export const addCategory = (body) => {
    return async (dispatch) => {
        try {
            const response = await CategoryService.postCategory(body);

            await dispatch(fetchCategories());

            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateCategory = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await CategoryService.putCategory(id, body);
            await dispatch(fetchCategories());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeCategory = (id) => {
    return async (dispatch) => {
        try {
            await CategoryService.deleteCategory(id);

            await dispatch(fetchCategories());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
