import SeatReservation from "../models/seat-reservation";
import {AbstractRepository} from "sqite-base";

export default class SeatReservationRepository extends AbstractRepository<SeatReservation> {
    constructor() {
        super('seat_reservation', SeatReservation);
    }
}
