import { Command } from "commander";
import AbstractCommand from "./abstract-command.js";
export default class ListCommand extends AbstractCommand {
    setup() {
        return new Command("list")
            .action((...args) => {
            this.execute(args);
        });
    }
    execute(args) {
        console.log(`# ID    Date${' '.repeat(15)}    Desc    Amount`);
        this.expenses.forEach(e => {
            console.log(`# ${e.id + (e.id && e.id < 10 ? ' ' : '')}    ${e.created_at.toDateString()}${' '.repeat(9 - (e.id && e.id < 10 ? 1 : 0))}${e.desc}    $${e.amount}`);
        });
    }
}
