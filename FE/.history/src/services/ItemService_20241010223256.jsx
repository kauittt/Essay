// Import the configured axios instance
import axios from "@/utils/axiosConfig";

let accessToken = JSON.parse(localStorage.getItem("accessToken"));

const ProductService = {
    getProducts: (paraToken) => {
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`items`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postProduct: (body) => {
        return axios.post(`products`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putProduct: (id, body) => {
        return axios.put(`products/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    delettProduct: (id) => {
        return axios.delete(`products/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default ProductService;
