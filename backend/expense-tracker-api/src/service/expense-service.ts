import Expense from "../data/models/expense";
import CategoryRepository from "../data/repository/category-repository";
import ExpenseRepository from "../data/repository/expense-repository";
import ForbiddenError from "../exceptions/forbidden-error";
import NotFoundError from "../exceptions/not-found-error";

export default class ExpenseService {

    private expenseRepository: ExpenseRepository;
    private categoryRepository: CategoryRepository;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.categoryRepository = new CategoryRepository();
    }

    getAllByUser(userId: number) {
        return this.expenseRepository
        .findBy({ userId })
        .then((expenses) => {
            if(expenses.length === 0) {
                throw new NotFoundError('No expenses found');
            }
            return expenses;
        });
    }

    createExpense(userId: number, description: string, amount: number, categoryCode: string) {
        return this.categoryRepository.findOneBy({code: categoryCode})
        .then((category) => {
            if(!category) {
                throw new NotFoundError('Invalid category');
            }
        
            const expense = new Expense(0, userId, category.id, amount, description, new Date());
        
            return this.expenseRepository.save(expense);
        });
    }

    updateExpense(userId: number, id: number, description: string, amount: number, categoryCode: string) {
        return this.expenseRepository.findById(id)
            .then((expense) => {
                if(!expense) {
                    throw new NotFoundError('Expense not found');
                }
            
                if(expense.userId !== userId) {
                    throw new ForbiddenError('You are not allowed to update this expense');
                }
            
                return this.categoryRepository.findOneBy({code: categoryCode}).then((category) => {
                    if(!category) {
                        throw new NotFoundError('Invalid category');
                    }
                
                    expense.amount = amount;
                    expense.description = description;
                    expense.categoryId = category.id;
                    expense.updatedAt = new Date();
                
                    return this.expenseRepository.save(expense);
                });
            });
    }

    deleteExpense(userId: number, id: number) {
        return this.expenseRepository.findById(id)
            .then((expense) => {
                if(!expense) {
                    throw new Error('Expense not found');
                }
            
                if(expense.userId !== userId) {
                    throw new ForbiddenError('You are not allowed to delete this expense');
                }
            
                return this.expenseRepository.delete(id);
            });
    }
}