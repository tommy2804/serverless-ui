import axios from "axios";
export const baseUrl = `http://localhost:5001/api`;
const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      alert(`Error (${status}): ${data.errors[0]?.message}`);
    } else if (error.request) {
      alert("No response received from the server.");
    } else {
      alert("Error in sending the request.");
    }
    return Promise.reject(error);
  }
);

export default api;
