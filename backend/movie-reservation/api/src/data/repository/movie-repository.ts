import Movie from "../models/movie";
import AbstractRepository from "./abstract-repository";

export default class MovieRepository extends AbstractRepository<Movie> {
    constructor() {
        super('movie', Movie)
    }
}