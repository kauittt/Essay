import axios from "axios";

// Set the base URL globally
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default axios;
