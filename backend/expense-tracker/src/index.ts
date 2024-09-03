#!/usr/bin/env node

import AddCommand from "./commands/add.js";
import DeleteCommand from "./commands/delete.js";
import ListCommand from "./commands/list.js";
import SummaryCommand from "./commands/summary.js";
import { Logger } from "./utils/Logger.js";
import Constants from "./utils/constants.js";
import JsonUtils from "./utils/json-utils.js";
import { Argument, Command, Option, OptionValues, program } from "commander";

program.addCommand(new Command("add")
        .addArgument(new Argument("description", "description of exepense"))
        .addArgument(new Argument("amount", "Expense value"))
        .addArgument(new Argument("[category]", "Expense category"))
        .action((function(description, amount, category) {
            new AddCommand().execute([description, amount, category]);
        })))

program.addCommand(new Command("list")
        .action((function() {
            new ListCommand().execute([]);
        })))

program.addCommand(new Command("summary")
        .addArgument(new Argument("[month]", "Expense summary by month number"))
        .action((function(month) {
            new SummaryCommand().execute([month]);
        })))

program.addCommand(new Command("delete")
        .addArgument(new Argument("id", "Expense id to delete"))
        .action((function(month) {
            new DeleteCommand().execute([month]);
        })))
    // .addCommand(new Command("list"))
    // .addCommand(new Command("summary"))
    // .addCommand(new Command("delete"))
    // .option('--description')
    // .option('--amount')
    // .option('--id')
    // .option('--month');


JsonUtils.createDirIfNotExists(Constants.JSON_PATH_DIR);
JsonUtils.createJsonFileIfNotExists(Constants.JSON_PATH_FILE, {expenses: []})
const command = program.parse();

// const options = program.opts();

// handleCommand(options);

/**
 *
 * @param {OptionValues} args
 */
function handleCommand(options: OptionValues) {
    const keys = Object.keys(options);

    try {
        validateArgs(keys);

        const command = keys[0];

        switch(command) {
            case "add":
                break;
            default:
                throw new Error("Not implemented!")
        }

    } catch (err: any) {
        Logger.error(err.message);
    }
}


/**
 * @throws {Error} args are not valid.
 * @param {string[]} args
 */
function validateArgs(args: string[]) {
    if(!args || args.length === 0) {
        throw new Error(`You must provide at least one arg!`)
    }
}

