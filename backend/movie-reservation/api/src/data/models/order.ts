import AbstractEntity from "./abstract-entity";

export default class Order extends AbstractEntity {
    number: string;
    movieSessionId: number;
    userId: number;
    total: number;

    constructor(id: number, number: string, movieSessionId: number, userId: number, total: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.movieSessionId = movieSessionId;
        this.userId = userId;
        this.number = number;
        this.total = total;
    }
}