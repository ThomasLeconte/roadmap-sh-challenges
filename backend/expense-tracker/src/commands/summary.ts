import { Argument, Command } from "commander";
import { Logger } from "../utils/Logger.js";
import AbstractCommand from "./abstract-command.js";

export default class SummaryCommand extends AbstractCommand {
    setup(): Command {
        return new Command("summary")
        .addArgument(new Argument("[month]", "Expense summary by month number"))
        .action((...args) => {
            this.execute(args);
        })
    }

    execute(args: any[]): void {
        const month = Number.parseInt(args[0]);

        let total = this.expenses
            .filter(e => !Number.isNaN(month) ? (e.created_at.getMonth() + 1) === month : true)
            .map(e => e.amount)
            .reduce((a,b) => a+b, 0);

        Logger.info(`Total expenses : $${total}`)
    }
}