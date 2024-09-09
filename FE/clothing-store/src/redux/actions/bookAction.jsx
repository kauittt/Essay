import BookService from "../../services/BookService";
import {
    deleteBookFailed,
    getBookGroupedFailed,
    getBookGroupedSuccess,
    getTotalBookFailed,
    getTotalBookSuccess,
    updateBookFailed,
} from "../reducers/bookSlice";

let accessToken = JSON.parse(localStorage.getItem("accessToken"));

export const getBookGrouped = (accessToken) => {
    return async (dispatch) => {
        try {
            const response = await BookService.fetchBookGrouped(accessToken);
            dispatch(getBookGroupedSuccess(response.data));
        } catch (error) {
            dispatch(getBookGroupedFailed(error.message));
        }
    };
};

export const getBook = (accessToken) => {
    return async (dispatch) => {
        try {
            const response = await BookService.fetchBook(accessToken);
            dispatch(getTotalBookSuccess(response.data));
        } catch (error) {
            dispatch(getTotalBookFailed(error.message));
        }
    };
};

export const updateBook = (id, body) => {
    return async (dispatch) => {
        try {
            await BookService.putUpdateBook(id, body);

            await dispatch(getBook(accessToken));
            await dispatch(getBookGrouped(accessToken));
        } catch (error) {
            dispatch(updateBookFailed(error.message));
        }
    };
};

export const removeBook = (id) => {
    return async (dispatch) => {
        try {
            await BookService.deleteRemoveBook(id);

            await dispatch(getBook(accessToken));
            await dispatch(getBookGrouped(accessToken));
        } catch (error) {
            dispatch(deleteBookFailed(error.message));
        }
    };
};
