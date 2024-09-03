import { OptionValues } from "commander";
import AbstractCommand from "./abstract-command.js";
import Expense from "../models/Expense.js";
import { Logger } from "../utils/Logger.js";

export default class AddCommand extends AbstractCommand {
    execute(args: any[]): void {
        try {
            const desc = args[0];
            const amount = Number.parseInt(args[1]);
            const category = args[2];
    
            const expense = new Expense(category, desc, amount, new Date());
            expense.id = !this.expenses || this.expenses.length === 0 ? 1 : Math.max(...this.expenses.map(e => e.id!!)) + 1;
    
            this.expenses.push(expense);
    
            this.updateExpenses(this.expenses);
    
            Logger.info("New expense added!");
        } catch (err: any) {
            Logger.error(err.message);
        }
    }
}