import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { Logger } from '../utils/Logger';

export type SetupOptions = {
    migrationsPath?: string;
}

export default class Database {

    private db: sqlite3.Database;

    private constructor(path: string, options?: SetupOptions) {
        this.db = new sqlite3.Database(path);
        if(options) {
            if(options.migrationsPath && options.migrationsPath.length > 0) {
                this.runMigrations(options.migrationsPath);
            }
        }
    }

    static setup(path: string = ':memory:', options?: SetupOptions): Database {
        return new Database(path, options);
    }

    private runMigrations(dirPath: string) {
        fs.readdirSync(dirPath).forEach((file: string) => {
            const filePath = `${dirPath}/${file}`;
            const fileContent = fs.readFileSync(filePath, 'utf8');
            this.db.serialize(() => {
                this.db.exec(fileContent, (err: any) => {
                    if (err) {
                        Logger.error(`[DATABASE] - Error executing migration ${file}`, false);
                        console.error(err);
                    }

                    Logger.success(`[DATABASE] - Migration ${file} executed successfully`, false);
                });
            });
        });
    }
}