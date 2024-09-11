import { log } from "console";
import Expense from "../data/models/expense";
import CategoryRepository from "../data/repository/category-repository";
import ExpenseRepository from "../data/repository/expense-repository";
import ForbiddenError from "../exceptions/forbidden-error";
import FunctionnalError from "../exceptions/functionnal-error";
import NotFoundError from "../exceptions/not-found-error";

export default class ExpenseService {

    private expenseRepository: ExpenseRepository;
    private categoryRepository: CategoryRepository;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.categoryRepository = new CategoryRepository();
    }

    getAllByUser(userId: number, requestParams: any) {
        const periodFilter = requestParams.period;
        const startDate = requestParams.startDate;
        const endDate = requestParams.endDate;

        return this.expenseRepository
        .findBy({ userId })
        .then((expenses) => {
            if(expenses.length === 0) {
                throw new NotFoundError('No expenses found');
            }

            if(periodFilter != null && (startDate != null || endDate != null)) {
                throw new FunctionnalError('You can only use period or startDate/endDate filter');
            }

            if(periodFilter != null) {
                // Validate period filter
                if(periodFilter.length < 2 || periodFilter.length > 2 || Number.isNaN(periodFilter[0]) || !["M", "W"].includes(periodFilter[1])) {
                    throw new FunctionnalError('Invalid period filter, use 1M for last month or 2W for last 2 weeks');
                }

                const now = new Date();
                const period = Number.parseInt(periodFilter[0]);
                const periodType = periodFilter[1];
                let periodStart = new Date();
                if(periodType === 'M') {
                    periodStart.setMonth(now.getMonth() - period);
                } else {
                    periodStart.setDate(now.getDate() - (period * 7));
                }
                expenses = expenses.filter((expense) => {
                    return periodStart >= new Date(expense.createdAt);
                });
            }

            if(startDate != null || endDate != null) {
                if(startDate != null) {
                    expenses = expenses.filter((expense) => {
                        return new Date(expense.createdAt) >= new Date(startDate);
                    });
                }

                if(endDate != null) {
                    expenses = expenses.filter((expense) => {
                        return new Date(expense.createdAt) <= new Date(endDate);
                    });
                }
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