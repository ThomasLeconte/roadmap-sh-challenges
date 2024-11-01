import {AbstractEntity} from "sqite-base";

export default class Seat extends AbstractEntity {
    code: string;
    row: number;
    movieRoomId: number;

    constructor(id: number, code: string, row: number, movieRoomId: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.code = code;
        this.row = row;
        this.movieRoomId = movieRoomId;
    }
}
