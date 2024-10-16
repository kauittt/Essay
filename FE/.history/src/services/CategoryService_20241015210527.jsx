// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const CategoryService = {
    getCategories: (paraToken) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`categories`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postCategories: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`categories`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putCategories: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`categories/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteCategory: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.delete(`categories/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default CategoryService;
