// Import the configured axios instance
import axios from "@/utils/axiosConfig";

const PaymentService = {
    createPayment: (body) => {
        let accessToken = JSON.parse(localStorage.getItem("accessToken"));
        return axios.post(`/api/payment/create_payment`, body, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
export default PaymentService;
