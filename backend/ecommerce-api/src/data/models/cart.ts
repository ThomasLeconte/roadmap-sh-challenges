import AbstractEntity from "./abstract-entity";

export default class Cart extends AbstractEntity {
    userId: number;
  
    constructor(id: number, userId: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.userId = userId;
    }
}