require('dotenv').config();

import express, {Request, Response, NextFunction} from 'express';
import authRoute from './routes/auth-router';
import {Database} from 'sqite-base';
import { logMiddleware } from './middleware/log-middleware';
import manageError from './utils/error-manager';
import { adminGuard, verifyToken } from './middleware/auth-middleware';
import movieRouter from './routes/movie-router';
import movieRoomRouter from './routes/movie-room-router';
import movieSessionRouter from './routes/movie-session-router';
import orderRouter from './routes/order-router';
import adminRouter from './routes/admin-router';
import cors from 'cors';

//change it with .env or something else
export const JWT_SECRET = 'SECRET_KEY';

// ---------------------------------------------------------------------

const app = express();

//CORS
app.use(cors());

//handle errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    manageError(err, res);
});

app.use(express.json());
app.use(logMiddleware);
app.use('/auth', authRoute);
app.use('/movie', verifyToken, movieRouter);
app.use('/movie-room', verifyToken, movieRoomRouter);
app.use('/movie-session', verifyToken, movieSessionRouter);
app.use('/order', verifyToken, orderRouter);
app.use('/admin', verifyToken, adminGuard, adminRouter);
app.use('/health', (req, res) => {
    res.send('OK');
});

app.listen(process.env.PORT || 3000, () => {

    Database.setup('src/database/db.sqlite', {
        migrationsPath: 'src/database/migrations'
    }).then(() => {
        console.log('Server is running on port 3000');
    });
});
