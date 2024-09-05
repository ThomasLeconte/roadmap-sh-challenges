import Database from "../../database/Database";
import User from "../models/user";
import AbstractRepository from "./abstract-repository";

export default class UserRepository extends AbstractRepository<User> {
    constructor() {
        super("user", User);
    }

    async findByUsername(username: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            Database.instance.get(`SELECT * FROM ${this.tableName} WHERE username = ?`, [username], (err, row: any) => {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(new User(row.id, row.username, row.password, row.email, row.createdAt));
                }
            });
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return null;
    }
}