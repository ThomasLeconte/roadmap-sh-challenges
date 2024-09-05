import fs from 'fs';
import Database from './database/Database';
import User from './models/user';
import UserRepository from './repository/user-repository';

Database.setup('src/database/db.sqlite', {
    migrationsPath: 'src/database/migrations'
}).then(() => {
    const user = new User(1, 'admin', 'admin', 'admin@admin.com', new Date());
    new UserRepository().save(user).then((user) => {
        console.log(user);
    });
});

