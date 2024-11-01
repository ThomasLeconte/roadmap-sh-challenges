import Seat from "../models/seat";
import {AbstractRepository} from "sqite-base";

export default class SeatRepository extends AbstractRepository<Seat> {
    constructor() {
        super('seat', Seat);
    }
}
