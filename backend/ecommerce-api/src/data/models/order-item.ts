import AbstractEntity from "./abstract-entity";

export default class OrderItem extends AbstractEntity {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;

    constructor(id: number, orderId: number, productId: number, quantity: number, price: number, created: Date, updated: Date) {
        super(id, created, updated);
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
}