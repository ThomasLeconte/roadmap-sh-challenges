import Category from "../models/category";
import AbstractRepository from "./abstract-repository";

export default class CategoryRepository extends AbstractRepository<Category> {
    constructor() {
        super('category', Category);
    }
}