import Order from "../models/order";
import AbstractRepository from "./abstract-repository";

export default class OrderRepository extends AbstractRepository<Order> {
    constructor() {
        super('order', Order)
    }
}