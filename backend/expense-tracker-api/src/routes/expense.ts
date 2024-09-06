import Router from 'express';
import Database from '../database/Database';
import { UserRequest } from '../utils/user-request';
import ExpenseRepository from '../data/repository/expense-repository';
import Expense from '../data/models/expense';
import CategoryRepository from '../data/repository/category-repository';

const router = Router();

router.get('/', async (req, res) => {
    const items = await new ExpenseRepository()
        .findBy({ user_id: Number.parseInt((req as UserRequest).userId) });

    res.status(200).json(items);
});

router.post('/', async (req, res) => {
    const { description, amount, categoryCode } = req.body;
    if(!description || !amount || !categoryCode) {
        res.status(400).send('Invalid request');
        return
    }
    const userId = (req as UserRequest).userId;

    const category = await new CategoryRepository().findOneBy({code: categoryCode});
    if(!category) {
        res.status(400).send('Invalid category');
        return;
    }

    const expense = new Expense(0, Number.parseInt(userId), category.id, amount, description, new Date());

    const result = await new ExpenseRepository().save(expense);

    res.status(201).json(result);
})

export default router;