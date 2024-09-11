import Product from "../models/product";
import AbstractRepository from "./abstract-repository";

export default class ProductRepository extends AbstractRepository<Product> {
    constructor() {
        super("product", Product);
    }
}