import {AbstractEntity} from "sqite-base";

export default class MovieRoom extends AbstractEntity {
    name: string;
    capacity: number;

    constructor(id: number, name: string, capacity: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.capacity = capacity;
    }
}
