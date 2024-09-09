import axios from "axios";

const AuthService = {
    postLogin: (body) =>
        axios
            .create({
                baseURL: "http://localhost:8081/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers":
                        "Origin, X-Requested-With, Content-Type, Accept",
                    "Access-Control-Allow-Origin": "https://localhost:5173",
                    "Access-Control-Allow-Methods":
                        "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    Accept: "application/json",
                },
            })
            .post("users/login", body),
    postRegister: (body) =>
        axios
            .create({
                baseURL: "http://localhost:8081/",
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers":
                        "Origin, X-Requested-With, Content-Type, Accept",
                    "Access-Control-Allow-Origin": "https://localhost:5173",
                    "Access-Control-Allow-Methods":
                        "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    Accept: "application/json",
                },
            })
            .post("users/register", body),
};

export default AuthService;
