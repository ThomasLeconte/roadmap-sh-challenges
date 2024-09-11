import CartProduct from "../models/cart-product";
import AbstractRepository from "./abstract-repository";

export default class CartProductRepository extends AbstractRepository<CartProduct> {
    constructor() {
        super("cart_product", CartProduct);
    }
}