import { Logger } from "../utils/Logger.js";
import AbstractCommand from "./abstract-command.js";
export default class DeleteCommand extends AbstractCommand {
    execute(...args) {
        const id = Number.parseInt(args[0]);
        if (Number.isNaN(id)) {
            Logger.error("Id provided is not a number!");
        }
        else {
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.updateExpenses(this.expenses);
            Logger.info(`Expense ${id} deleted successfully!`);
        }
    }
}
