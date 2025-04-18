import axios from "axios";

const api = axios.create({
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for logging errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
