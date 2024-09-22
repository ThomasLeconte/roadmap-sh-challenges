import AbstractEntity from "./abstract-entity";

export default class Order extends AbstractEntity {
    userId: number;
    paymentIntentId: string;
    status: string;

    constructor(id: number, userId: number, paymentIntentId: string, status: string, created: Date, updated: Date) {
        super(id, created, updated);
        this.userId = userId;
        this.paymentIntentId = paymentIntentId;
        this.status = status;
    }
}