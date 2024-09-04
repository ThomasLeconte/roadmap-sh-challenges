import fs from 'fs';
import Database from './database/Database';

Database.setup(':memory:', {
    migrationsPath: 'src/database/migrations'
});