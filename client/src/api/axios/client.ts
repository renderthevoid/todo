import axios from "axios";
import { requestInterceptor } from "./interceptors/request";
import { errorInterceptor, responseInterceptor } from "./interceptors/response";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosClient.interceptors.request.use(requestInterceptor);
axiosClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default axiosClient;
