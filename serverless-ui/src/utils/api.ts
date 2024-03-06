import axios from "axios";
export const baseUrl = ``;
const api = axios.create({
  baseURL: baseUrl,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("userToken");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }

//   return config;
// });



export default api;
