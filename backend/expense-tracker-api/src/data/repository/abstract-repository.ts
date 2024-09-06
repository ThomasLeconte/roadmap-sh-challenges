import Database from "../../database/Database";
import AbstractEntity from "../models/abstract-entity";

export default class AbstractRepository <T extends AbstractEntity> {
    protected tableName: string;
    protected entity: new (...args: any[]) => T;

    constructor(tableName: string, entity: new (...args: any[]) => T) {
        this.tableName = tableName;
        this.entity = entity;
    }

    async findAll(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            Database.instance.all(`SELECT * FROM ${this.tableName}`, (err, rows) => {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows.map((row: any) => {
                        const entity = new this.entity();
                        Object.assign(entity as object, row);
                        return entity;
                    }));
                }
            });
        });
    }

    async findBy(args: { [key: string]: any }): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const conditions = Object.keys(args).map((key, index) => {
                return `${key} = ${args[key]}`;
            })

            Database.instance.get(`SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')}`, (err, rows: any) => {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    if(!rows) {
                        resolve([]);
                    } else {
                        resolve(rows.map((row: any) => {
                            const entity = new this.entity();
                            Object.assign(entity as object, row);
                            return entity;
                        }));
                    }
                }
            });
        })
    }

    async findById(id: number): Promise<T | null> {
        return null;
    }

    toKebabCase(str: string): string {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase();
    }

    async save(entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            if(entity.id) {
                resolve(this.update(entity));
            } else {
                resolve(this.create(entity));
            }
        });
    }

    async create(entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            const columns = Object.keys(entity).filter((key) => key !== 'id').map(this.toKebabCase);
            const values = columns.map((key) => (entity as any)[key]);
            const placeholders = columns.map(() => '?').join(', ');

            Database.instance.run(`INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`, values, function(err) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    entity.id = this.lastID;
                    resolve(entity);
                }
            });
        })
    }

    async update(entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            const columns = Object.keys(entity).filter((key) => key !== 'id').map(this.toKebabCase);
            const values = columns.map((key) => (entity as any)[key]);
            const placeholders = columns.map((key) => `${this.toKebabCase(key)} = ?`).join(', ');

            Database.instance.run(`UPDATE ${this.tableName} SET ${placeholders} WHERE id = ?`, [...values, entity.id], function(err) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(entity);
                }
            });
       });
    }

    async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Database.instance.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], function(err) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    }
}