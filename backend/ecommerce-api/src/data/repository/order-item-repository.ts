import OrderItem from "../models/order-item";
import AbstractRepository from "./abstract-repository";

export default class OrderItemRepository extends AbstractRepository<OrderItem> {
    constructor() {
        super('order_item', OrderItem);
    }
}