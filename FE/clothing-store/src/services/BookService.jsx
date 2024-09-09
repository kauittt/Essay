import axios from "axios";

let accessToken = JSON.parse(localStorage.getItem("accessToken"));

const BookService = {
    fetchBookGrouped: (paraToken) => {
        const token = paraToken ? paraToken : accessToken;
        return axios
            .create({
                baseURL: "http://localhost:8080/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass token here!!
                },
            })
            .get(`books/grouped`);
    },
    fetchBook: (paraToken) => {
        const token = paraToken ? paraToken : accessToken;
        return axios
            .create({
                baseURL: "http://localhost:8080/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass token here!!
                },
            })
            .get(`books`);
    },
    putUpdateBook: (id, body) => {
        return axios
            .create({
                baseURL: "http://localhost:8080/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Pass token here!!
                },
            })
            .put(`books/${id}`, body);
    },
    deleteRemoveBook: (id) => {
        return axios
            .create({
                baseURL: "http://localhost:8080/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Pass token here!!
                },
            })
            .delete(`books/${id}`);
    },
};

export default BookService;
