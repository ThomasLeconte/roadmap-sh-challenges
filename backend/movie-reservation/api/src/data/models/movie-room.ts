import {AbstractEntity} from "sqite-base";

export default class MovieRoom extends AbstractEntity {
    name: string;
    capacity: number;
    is3d: boolean;
    is4dx: boolean;
    isImax: boolean;
    isDbox: boolean;

    constructor(id: number, name: string, capacity: number, is3d: boolean, is4dx: boolean, isImax: boolean, isDbox: boolean, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.capacity = capacity;
        this.is3d = is3d;
        this.is4dx = is4dx;
        this.isImax = isImax;
        this.isDbox = isDbox;
    }
}
