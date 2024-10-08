import express, {Request, Response, NextFunction} from 'express';

import authRoute from './routes/auth-router';
import productRoute from './routes/product-router';
import cartRoute from './routes/cart-router';
import orderRouter from './routes/order-router';
import Database from './database/Database';
import { logMiddleware } from './middleware/log-middleware';
import manageError from './utils/error-manager';
import { verifyToken } from './middleware/auth-middleware';

//change it with .env or something else
export const JWT_SECRET = 'SECRET_KEY';

const app = express();

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
app.use('/products', verifyToken, productRoute);
app.use('/cart', verifyToken, cartRoute);
app.use('/order', orderRouter);

app.listen(process.env.PORT || 3000, () => {

    Database.setup('src/database/db.sqlite', {
        migrationsPath: 'src/database/migrations'
    }).then(() => {
        console.log('Server is running on port 3000');
    });
});