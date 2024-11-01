import Order from "../models/order";
import {AbstractRepository} from "sqite-base";

export default class OrderRepository extends AbstractRepository<Order> {
    constructor() {
        super('order', Order)
    }
}
