import { Entity } from "../../decorators/entity";
import AbstractEntity from "./abstract-entity";

@Entity()
export default class User extends AbstractEntity {
    stripeId: string;
    username: string;
    password: string;
    email: string;
  
    constructor(id: number, stripeId: string, username: string, password: string, email: string, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.stripeId = stripeId;
        this.username = username;
        this.password = password;
        this.email = email;
    }
}