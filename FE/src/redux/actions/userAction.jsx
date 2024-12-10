import CategoryService from "../../services/CategoryService";
import UserService from "../../services/UserService";
import { getCategoriesSuccess } from "../reducers/categorySlice";
import { getTotalUsersSuccess, getUserSuccess } from "../reducers/userSlice";

export const fetchUsers = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await UserService.getUsers(token);
            dispatch(getTotalUsersSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const fetchCurrentUser = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await UserService.getCurrentUser(token);
            dispatch(getUserSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const addUser = (body) => {
    return async (dispatch) => {
        try {
            const response = await UserService.postUser(body);

            await dispatch(fetchUsers());

            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateUser = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await UserService.putUser(id, body);
            await dispatch(fetchUsers());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateCurrentUser = (body) => {
    return async (dispatch) => {
        try {
            const response = await UserService.putCurrentUser(body);
            // await dispatch(fetchUsers());
            await dispatch(fetchCurrentUser());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateResetUser = (body) => {
    return async (dispatch) => {
        try {
            const response = await UserService.putResetUser(body);
            // await dispatch(fetchUsers());
            // await dispatch(fetchCurrentUser());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeUser = (id) => {
    return async (dispatch) => {
        try {
            await UserService.deleteUser(id);

            await dispatch(fetchUsers());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
