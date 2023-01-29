import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/";
export default axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("photoStockUser"));
  console.log(user);
  if (user) {
    config.headers["Authorization"] = `Bearer ${user?.token}`;
  }
  return config;
});
