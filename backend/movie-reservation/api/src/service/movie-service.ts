import { release } from "os";
import Movie from "../data/models/movie";
import MovieRepository from "../data/repository/movie-repository";
import QueryBuilder from "../data/repository/query-builder";

export default class MovieService {
    movieRepository: MovieRepository;

    constructor() {
        this.movieRepository = new MovieRepository();
    }

    async searchMovies(query: string | undefined) {
        if (!query) {
            return this.movieRepository.findAll();
        }
        return this.movieRepository.query(new QueryBuilder('movie').whereLike('title', `%${query}%`).build(), Movie);
    }

    async getMovieById(id: number) {
        return await this.movieRepository.findById(id);
    }

    async createMovie(title: string, description: string, releaseDate: number, duration: number, image?: string) {
        const movie = new Movie(0, title, description, image ?? "", new Date(releaseDate), duration, new Date());

        return await this.movieRepository.save(movie);
    }
}