import {AbstractEntity} from "sqite-base";

export default class SeatReservation extends AbstractEntity {
    seatId: number;
    movieSessionId: number;
    orderId: number;

    constructor(id: number, seatId: number, movieSessionId: number, orderId: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.seatId = seatId;
        this.movieSessionId = movieSessionId;
        this.orderId = orderId;
    }
}
