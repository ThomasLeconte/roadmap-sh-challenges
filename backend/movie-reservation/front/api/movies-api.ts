import axios from "./axios.config";

export class MoviesApi {

    static async getMovies(){
        return axios.get('/movie')
    }

    static async getMovieDetails(id: number) {
        return axios.get(`/movie/${id}`)
    }

    static async getMovieSessions(id: number) {
        return axios.get(`/movie-session/movie/${id}`)
    }
}