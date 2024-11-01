import MovieSession from "../models/movie-session";
import {AbstractRepository} from "sqite-base";

export default class MovieSessionRepository extends AbstractRepository<MovieSession> {
    constructor() {
        super('movie_session', MovieSession)
    }

    async findByMovieAndDate(movieId: number, date: Date) {
        const dateAtMidnight = new Date(date);
        dateAtMidnight.setHours(0, 0, 0, 0);
        const dateAtEndOfDay = new Date(dateAtMidnight);
        dateAtEndOfDay.setHours(23, 59, 59, 999);

        return this.query(`SELECT * FROM ${this.tableName} WHERE movie_id = ? AND start_date BETWEEN ? AND ?`, MovieSession, [movieId, dateAtMidnight, dateAtEndOfDay]);
    }
}
