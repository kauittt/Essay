// Import the configured axios instance
import axios from "@/utils/axiosConfig";

let accessToken = JSON.parse(localStorage.getItem("accessToken"));

const ItemService = {
    getItems: (paraToken) => {
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`items`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postItem: (body) => {
        return axios.post(`items`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putItem: (id, body) => {
        return axios.put(`items/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteItem: (id) => {
        return axios.delete(`items/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default ItemService;
