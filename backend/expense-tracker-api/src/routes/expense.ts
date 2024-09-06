import Router from 'express';
import Database from '../database/Database';
import { UserRequest } from '../utils/user-request';
import ExpenseRepository from '../data/repository/expense-repository';

const router = Router();

router.get('/', async (req, res) => {
    const items = await new ExpenseRepository()
        .findBy({ user_id: Number.parseInt((req as UserRequest).userId) });

    res.status(200).json(items);
});

export default router;