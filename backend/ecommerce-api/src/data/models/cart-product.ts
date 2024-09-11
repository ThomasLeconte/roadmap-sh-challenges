import AbstractEntity from "./abstract-entity";

export default class CartProduct extends AbstractEntity {
    cartId: number;
    productId: number;
    quantity: number;
  
    constructor(id: number, cartId: number, productId: number, quantity: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
    }
}