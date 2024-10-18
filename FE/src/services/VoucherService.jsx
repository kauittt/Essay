// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const VoucherService = {
    getVouchers: (paraToken) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        const token = paraToken ? paraToken : accessToken;
        return axios.get(`vouchers`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    },
    postVoucher: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`vouchers`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    putVoucher: (id, body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.put(`vouchers/${id}`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteVoucher: (id) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.delete(`vouchers/${id}`, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default VoucherService;
