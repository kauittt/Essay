// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const CartService = {
    putCart: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`carts/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    cleanCart: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`carts/clean/${id}`, null, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
export default CartService;
