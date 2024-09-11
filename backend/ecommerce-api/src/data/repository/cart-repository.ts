import Cart from "../models/cart";
import AbstractRepository from "./abstract-repository";

export default class CartRepository extends AbstractRepository<Cart> {
    constructor() {
        super("cart", Cart);
    }
}