// src/axiosConfig.js
import axios from 'axios';

// Set the base URL globally
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export default axios;