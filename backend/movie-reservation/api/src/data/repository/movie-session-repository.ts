import MovieSession from "../models/movie-session";
import AbstractRepository from "./abstract-repository";

export default class MovieSessionRepository extends AbstractRepository<MovieSession> {
    constructor() {
        super('movie_session', MovieSession)
    }
}