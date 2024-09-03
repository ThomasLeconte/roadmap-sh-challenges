import { Logger } from "../utils/Logger.js";
import AbstractCommand from "./abstract-command.js";

export default class SummaryCommand extends AbstractCommand {
    execute(args: any[]): void {
        const month = Number.parseInt(args[0]);

        let total = this.expenses
            .filter(e => !Number.isNaN(month) ? (e.created_at.getMonth() + 1) === month : true)
            .map(e => e.amount)
            .reduce((a,b) => a+b, 0);

        Logger.info(`Total expenses : $${total}`)
    }
}