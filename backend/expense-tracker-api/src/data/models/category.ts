import AbstractEntity from "./abstract-entity";

export default class Category extends AbstractEntity {
    code: string;
    name: string;

    constructor(id: number, code: string, name: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.code = code;
        this.name = name;
    }
}