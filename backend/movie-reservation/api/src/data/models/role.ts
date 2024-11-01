import {AbstractEntity} from "sqite-base";

export default class Role extends AbstractEntity {
    name: string;

    constructor(id: number, name: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.name = name;
    }
}
