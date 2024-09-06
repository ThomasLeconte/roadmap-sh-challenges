import express from 'express';

import authRoute from './routes/auth';
import protectedRoute from './routes/protectedRoute';
import expensesRoute from './routes/expense';
import Database from './database/Database';
import { verifyToken } from './middleware/auth-middleware';

//change it with .env or something else
export const JWT_SECRET = 'SECRET_KEY';

const app = express();

app.use(express.json());
app.use('/auth', authRoute);
app.use('/protected', verifyToken, protectedRoute);
app.use('/expenses', verifyToken, expensesRoute);

app.listen(process.env.PORT || 3000, () => {

    Database.setup('src/database/db.sqlite', {
        migrationsPath: 'src/database/migrations'
    }).then(() => {
        console.log('Server is running on port 3000');
    });
});

