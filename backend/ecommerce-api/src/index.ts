import express, {Request, Response, NextFunction} from 'express';

import authRoute from './routes/auth';
import Database from './database/Database';
import { verifyToken } from './middleware/auth-middleware';
import { logMiddleware } from './middleware/log-middleware';

//change it with .env or something else
export const JWT_SECRET = 'SECRET_KEY';

const app = express();

app.use(express.json());
app.use(logMiddleware);
app.use('/auth', authRoute);

app.listen(process.env.PORT || 3000, () => {

    Database.setup('src/database/db.sqlite', {
        migrationsPath: 'src/database/migrations'
    }).then(() => {
        console.log('Server is running on port 3000');
    });
});

