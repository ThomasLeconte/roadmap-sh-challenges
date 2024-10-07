import AbstractEntity from "./abstract-entity";

export default class MovieSession extends AbstractEntity {
    movieId: number;
    movieRoomId: number;
    startDate: Date;
    endDate: Date;

    constructor(id: number, movieId: number, movieRoomId: number, startDate: Date, endDate: Date, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.movieId = movieId;
        this.movieRoomId = movieRoomId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}