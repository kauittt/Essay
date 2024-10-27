import FeedbackService from "../../services/FeedbackService";
import { fetchProducts } from "./productAction";

// export const fetchFeedbacks = (paraToken) => {
//     let accessToken = JSON.parse(localStorage.getItem("accessToken"));
//     const token = paraToken || accessToken;
//     return async (dispatch) => {
//         try {
//             const response = await FeedbackService.getFeedbacks(token);
//             dispatch(getFeedbacksSuccess(response.data));
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     };
// };

export const addFeedback = (body) => {
    return async (dispatch) => {
        try {
            const response = await FeedbackService.postFeedback(body);
            await dispatch(fetchProducts());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateFeedback = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await FeedbackService.putFeedback(id, body);
            await dispatch(fetchProducts());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeFeedback = (id) => {
    return async (dispatch) => {
        try {
            await FeedbackService.deleteFeedback(id);
            await dispatch(fetchProducts());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
