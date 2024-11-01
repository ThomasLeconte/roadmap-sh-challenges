import axios, {AxiosResponse} from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use((config) => {
    if(localStorage.getItem("token")) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
})

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(error.response.status === 401) {
        // refresh token
        return axios.post("/auth/refresh-token", {token: localStorage.getItem("token")})
            .then((response: AxiosResponse) => {
                localStorage.setItem("token", response.data.token);
                return axios.request(error.response.config);
            })
            .catch(() => {
                localStorage.removeItem("token");
            })
    }
})

export default axios;