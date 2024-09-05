import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { Logger } from '../utils/Logger';

export type SetupOptions = {
    migrationsPath?: string;
}

export default class Database {

    private static db: sqlite3.Database;

    static get instance(): sqlite3.Database {
        if(!Database.db) {
            throw new Error('Database is not initialized');
        }
        return Database.db;
    }

    private constructor(path: string) {
        Database.db = new sqlite3.Database(path, (err: any) => {
            if (err) {
                Logger.error('[DATABASE] - Error connecting to the database', false);
                console.error(err);
            }
            Logger.success('[DATABASE] - Connected to the database', false);
        });
    }

    static setup(path: string = ':memory:', options?: SetupOptions): Promise<Database> {
        return Promise.resolve(new Database(path)).then((db) => {
            if(options) {
                if(options.migrationsPath && options.migrationsPath.length > 0) {
                    Logger.info('[DATABASE] - Running migrations', false);
                    return db.initMigrationsTable().then(() => {
                        return db.runMigrations(options.migrationsPath)?.then(() => {
                            return db;
                        });
                    });
                }  else {
                    Logger.success('[DATABASE] - No migrations found', false);
                    return db;
                }
            } else {
                Logger.success('[DATABASE] - No options found', false);
                return db;
            }
        });
    }

    private runMigrations(dirPath: string | undefined): Promise<unknown[]> {
        if(!dirPath) {
            return Promise.resolve([]);
        }

        return Promise.all(fs.readdirSync(dirPath).map((file: string) => {
            if(!file.endsWith('.sql')) {
                return;
            }
            return this.migrationExecuted(file).then((result) => {
                if(result) {
                    return;
                }

                const filePath = `${dirPath}/${file}`;
                const fileContent = fs.readFileSync(filePath, 'utf8');
                return new Promise((resolve, reject) => {
                    Database.instance.serialize(() => {
                        Database.instance.exec(fileContent, (err: any) => {
                            if (err) {
                                Logger.error(`[DATABASE] - Error executing migration ${file}`, false);
                                console.error(err);
                                reject(err);
                            }
        
                            this.insertMigration(file);
        
                            Logger.success(`[DATABASE] - Migration ${file} executed successfully`, false);
                            resolve(true);
                        });
                    });
                });
            });
        }));
    }

    private migrationExecuted(name: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            Database.instance.serialize(() => {
                Database.instance.get('SELECT * FROM migrations WHERE name = ?', [name], (err: any, row: any) => {
                    if (err) {
                        Logger.error(`[DATABASE] - Error checking if migration ${name} was executed`, false);
                        console.error(err);
                        reject(err);
                    }
                    resolve(row !== undefined);
                });
            });
        });
    }

    private insertMigration(name: string) {
        Database.instance.serialize(() => {
            Database.instance.run('INSERT INTO migrations (name) VALUES (?)', [name]);
        });
    }

    private migrationTableExists(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Database.instance.serialize(() => {
                Database.instance.get("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'", (err: any, row: any) => {
                    if (err) {
                        Logger.error('[DATABASE] - Error checking if migrations table exists', false);
                        console.error(err);
                        reject(err);
                    }
                    resolve(row !== undefined);
                });
            });
        });
    }

    private initMigrationsTable() {
        return this.migrationTableExists().then((exists) => {
            if(exists) {
                return true;
            }
            return this.createMigrationsTable();
        });
    };

    private createMigrationsTable() {
        return new Promise((resolve, reject) => {
            Database.instance.serialize(() => {
                Database.instance.run(`
                    CREATE TABLE IF NOT EXISTS migrations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    )
                `, (err: any) => {
                    if (err) {
                        Logger.error('[DATABASE] - Error creating migrations table', false);
                        console.error(err);
                        reject(err);
                    }
                    Logger.success('[DATABASE] - Migrations table created successfully', false);
                    resolve(true);
                });
            });
        });
    }
}