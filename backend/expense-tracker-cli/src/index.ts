#!/usr/bin/env node

import AddCommand from "./commands/add.js";
import DeleteCommand from "./commands/delete.js";
import ListCommand from "./commands/list.js";
import SummaryCommand from "./commands/summary.js";
import { Logger } from "./utils/Logger.js";
import Constants from "./utils/constants.js";
import JsonUtils from "./utils/json-utils.js";
import { program } from "commander";

try {
    JsonUtils.createDirIfNotExists(Constants.JSON_PATH_DIR);
    JsonUtils.createJsonFileIfNotExists(Constants.JSON_PATH_FILE, {expenses: []})

    program.addCommand(new AddCommand().setup())

    program.addCommand(new ListCommand().setup())

    program.addCommand(new SummaryCommand().setup())

    program.addCommand(new DeleteCommand().setup())

    program.parse();
} catch (err: any) {
    Logger.error(err.message);
}
