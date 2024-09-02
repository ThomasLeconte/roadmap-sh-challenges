import { OptionValues } from "commander";
import AbstractCommand from "./abstract-command.js";

export default class AddCommand extends AbstractCommand {
    execute(args: OptionValues): void {
        throw new Error("Method not implemented.");
    }
}