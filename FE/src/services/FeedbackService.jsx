// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const FeedbackService = {
    postFeedback: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`feedbacks`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putFeedback: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`feedbacks/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteFeedback: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.delete(`feedbacks/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default FeedbackService;
