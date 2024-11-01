import {AbstractEntity} from "sqite-base";

export default class Movie extends AbstractEntity {
    title: string;
    description: string;
    image: string;
    releaseDate: Date;
    duration: number;

    constructor(id: number, title: string, description: string, image: string, releaseDate: Date, duration: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.title = title;
        this.description = description;
        this.image = image;
        this.releaseDate = releaseDate;
        this.duration = duration;
    }
}
