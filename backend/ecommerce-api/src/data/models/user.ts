import { Entity } from "../../decorators/entity";
import AbstractEntity from "./abstract-entity";

@Entity()
export default class User extends AbstractEntity {
    username: string;
    password: string;
    email: string;
  
    constructor(id: number, username: string, password: string, email: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.username = username;
        this.password = password;
        this.email = email;
    }
}