#!/usr/bin/env node

import AddCommand from "./commands/add.js";
import { Logger } from "./utils/Logger.js";
import Constants from "./utils/constants.js";
import JsonUtils from "./utils/json-utils.js";
import { Command, OptionValues, program } from "commander";

program.addCommand(new Command("add"))
    .option('--description')
    .option('--amount')
    .option('--id')
    .option('--month');

program.parse();

const options = program.opts();

handleCommand(options);

/**
 *
 * @param {OptionValues} args
 */
function handleCommand(options: OptionValues) {
    const keys = Object.keys(options);

    try {
        validateArgs(keys);

        JsonUtils.createDirIfNotExists(Constants.JSON_PATH_DIR);
        JsonUtils.createJsonFileIfNotExists(Constants.JSON_PATH_FILE, {expenses: []})

        const command = keys[0];

        switch(command) {
            case "add":
                new AddCommand().execute(options);
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

