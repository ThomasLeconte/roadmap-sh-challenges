import axios from "../api/axios.config";

export class AuthApi {
    static async register(username: string, email: string, password: string) {
        return axios.post('auth/register', { username, email, password });
    }

    static async login(username: string, password: string) {
        return axios.post('auth/login', { username, password });
    }
}