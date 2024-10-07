import MovieRoom from "../models/movie-room";
import AbstractRepository from "./abstract-repository";

export default class MovieRoomRepository extends AbstractRepository<MovieRoom> {
    constructor() {
        super('movie_room', MovieRoom)
    }
}