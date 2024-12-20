import User from "../models/user";
import {AbstractRepository, Database} from "sqite-base";

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
                    if(row) {
                        resolve(this.deserialize(row));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return null;
    }
}
