// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const UserService = {
    getUsers: (paraToken) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`users`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postUser: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`users/register`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putUser: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`users/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteUser: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.delete(`users/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default UserService;
