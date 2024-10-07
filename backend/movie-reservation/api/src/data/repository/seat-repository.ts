import Seat from "../models/seat";
import AbstractRepository from "./abstract-repository";

export default class SeatRepository extends AbstractRepository<Seat> {
    constructor() {
        super('seat', Seat);
    }
}