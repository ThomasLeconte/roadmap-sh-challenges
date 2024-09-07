import Router from 'express';
import { UserRequest } from '../utils/user-request';
import ExpenseService from '../service/expense-service';
import manageError from '../utils/error-manager';

const router = Router();
const expenseService = new ExpenseService();

router.get('/', async (req, res) => {
    expenseService
        .getAllByUser(Number.parseInt((req as UserRequest).userId))
        .then((expenses) => {
            res.status(200).json(expenses);
        }).catch((err) => {
            manageError(err, res);
        });
});

router.post('/', async (req, res) => {
    const { description, amount, categoryCode } = req.body;
    if(!description || !amount || !categoryCode) {
        res.status(400).send('Invalid request');
        return
    }
    const userId = Number.parseInt((req as UserRequest).userId);

    expenseService
        .createExpense(userId, description, amount, categoryCode)
        .then((expense) => {
            res.status(201).json(expense);
        }).catch((err) => {
            manageError(err, res);
        });
})

router.put('/:id', async (req, res) => {
    const { description, amount, categoryCode } = req.body;
    if(!description || !amount || !categoryCode) {
        res.status(400).send('Invalid request');
        return
    }
    const userId = (req as unknown as UserRequest).userId;

    expenseService
        .updateExpense(Number.parseInt(userId), Number.parseInt(req.params.id), description, amount, categoryCode)
        .then((expense) => {
            res.status(200).json(expense);
        }).catch((err) => {
            manageError(err, res);
        });
});

router.delete('/:id', async (req, res) => {
    const userId = (req as unknown as UserRequest).userId;

    expenseService.deleteExpense(Number.parseInt(userId), Number.parseInt(req.params.id))
        .then(() => {
            res.status(204).send();
        }).catch((err) => {
            manageError(err, res);
        });
});

export default router;