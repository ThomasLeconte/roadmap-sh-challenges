import AbstractEntity from "./abstract-entity";

export default class Expense extends AbstractEntity {
    userId: number;
    categoryId: number;
    amount: number;
    description: string;

    constructor(id: number, userId: number, categoryId: number, amount: number, description: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.userId = userId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.description = description;
    }
}