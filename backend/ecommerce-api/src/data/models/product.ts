import AbstractEntity from "./abstract-entity";

export default class Product extends AbstractEntity {
    name: string;
    price: number;
    description: string;
    image: string;
  
    constructor(id: number, name: string, price: number, description: string, image: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }
}