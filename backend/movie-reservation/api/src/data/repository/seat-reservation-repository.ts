import SeatReservation from "../models/seat-reservation";
import AbstractRepository from "./abstract-repository";

export default class SeatReservationRepository extends AbstractRepository<SeatReservation> {
    constructor() {
        super('seat_reservation', SeatReservation);
    }
}