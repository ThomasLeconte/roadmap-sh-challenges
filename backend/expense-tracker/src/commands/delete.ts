import { Argument, Command } from "commander";
import { Logger } from "../utils/Logger.js";
import AbstractCommand from "./abstract-command.js";

export default class DeleteCommand extends AbstractCommand {
    setup(): Command {
        return new Command("delete")
        .addArgument(new Argument("id", "Expense id to delete"))
        .action((...args) => {
            this.execute(args);
        })
    }
    execute(args: any[]): void {
        const id = Number.parseInt(args[0]);

        if(Number.isNaN(id)) {
            Logger.error("Id provided is not a number!")
        } else {
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.updateExpenses(this.expenses);
            Logger.info(`Expense ${id} deleted successfully!`)
        }
    }
    
}