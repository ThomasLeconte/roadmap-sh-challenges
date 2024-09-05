import User from "../models/user";
import AbstractRepository from "./abstract-repository";

export default class UserRepository extends AbstractRepository<User> {
    constructor() {
        super("user", User);
    }

    async findByUsername(username: string): Promise<User | null> {
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return null;
    }
}