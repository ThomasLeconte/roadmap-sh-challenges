#! /usr/bin/env node

import Logger from "../utils/Logger.js";
import Task from "./models/task.js";
import JsonUtils from "../utils/JsonUtils.js";
import Constants from "./constants.js";
import ListCommand from "./commands/list.js";
import AddCommand from "./commands/add.js";
import DeleteCommand from "./commands/delete.js";
import UpdateCommand from "./commands/update.js";

const argv = process.argv.slice(2);
handleCommand(argv);

/**
 *
 * @param {string[]} args
 */
function handleCommand(args) {
    try {
        validateArgs(args);
        JsonUtils.createDirIfNotExists(Constants.JSON_PATH_DIR);
        JsonUtils.createJsonFileIfNotExists(Constants.JSON_PATH_FILE, {tasks: []});


        switch(args[0]) {
            case "list":
                new ListCommand().execute(args);
                break;

            case "add":
                new AddCommand().execute(args);
                break;

            case "update":
            case "delete":
            case "mark-done":
            case "mark-in-progress":

                let taskId = Number.parseInt(args[1]);
                const isValidId = Number.isInteger(taskId);
                if (isValidId) {

                    if(args[0] === "update") {
                        new UpdateCommand().execute(taskId, args.slice(2).join(" "), null);
                        Logger.info(`Task ${taskId} updated successfully!`)
                    } else if (args[0] === "delete") {
                        new DeleteCommand().execute(taskId);
                    } else if (args[0] === "mark-in-progress") {
                        new UpdateCommand().execute(taskId, null, 1);
                        Logger.info(`Task ${taskId} in progress!`)
                    } else {
                        new UpdateCommand().execute(taskId, null, 2);
                        Logger.info(`Task ${taskId} completed!`)
                    }
                } else {
                    throw new Error("Task id is not a number!")
                }
                break;
            default:
                throw new Error("Not implemented!");
        }

    } catch (err) {
        Logger.error(err);
    }
}

/**
 * @throws {Error} args are not valid.
 * @param {string[]} args
 */
function validateArgs(args) {
    if(!args || args.length === 0) {
        throw new Error(`You must provide at least one arg. \nYou can use "list", "add", "update", "delete", "mark-in-progress" or "mark-done" !`)
    }
}





