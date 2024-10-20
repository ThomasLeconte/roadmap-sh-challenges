import axios from "./axios.config";

export class MovieSessionsApi {
    static async getSessionById(id: number) {
        return axios.get(`/movie-session/${id}`)
    }

    static async getSeatsAvailability(id: number) {
        return axios.get(`/movie-session/${id}/seats-availability`)
    }

    static async getMovieSessionsByMovieIdAndDate(movieId: number, date: string) {
        return axios.get(`/movie-session/movie/${movieId}/date/${date}`)
    }
}