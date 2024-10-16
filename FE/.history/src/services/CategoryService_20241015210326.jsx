// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const CategoryService = {
    getCategoriess: (paraToken) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`Categoriess`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postCategories: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`Categoriess`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putCategories: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`Categoriess/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteCategories: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.delete(`Categoriess/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default CategoriesService;
