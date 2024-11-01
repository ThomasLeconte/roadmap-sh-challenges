import MovieRoom from "../models/movie-room";
import {AbstractRepository} from "sqite-base";

export default class MovieRoomRepository extends AbstractRepository<MovieRoom> {
    constructor() {
        super('movie_room', MovieRoom)
    }
}
