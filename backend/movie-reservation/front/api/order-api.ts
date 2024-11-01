import axios from "./axios.config";

export default class OrderApi {
    static async computeOrder(sessions: any) {
        return axios.post('/order/compute', sessions)
    }

    static async createOrder(movieSessionId: number, seats: string[]) {
        return axios.post('/order', {movieSessionId, seats})
    }
}