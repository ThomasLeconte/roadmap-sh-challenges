import AbstractEntity from "./abstract-entity";

export default class Product extends AbstractEntity {
    stripeId: string;
    name: string;
    price: number;
    description: string;
    image: string;
  
    constructor(id: number, stripeId: string, name: string, price: number, description: string, image: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.stripeId = stripeId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }
}