// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const AuthService = {
    postLogin: (body) => {
        return axios.post("users/login", body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    postRegister: (body) => {
        return axios.post("users/register", body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};

export default AuthService;
