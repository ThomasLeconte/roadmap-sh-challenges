#!/usr/bin/env node
import { Logger } from "./utils/Logger.js";
import { Option, program } from "commander";
import { startServer } from "./server.js";
try {
    program.addOption(new Option("-p, --port <port>", "Port to run the server on").default("3000"))
        .addOption(new Option("-h, --host <host>", "Host to run the server on"))
        .addOption(new Option("-c, --clear-cache", "Clear the cache"));
    const command = program.parse();
    if (command.opts() == null) {
        Logger.error("Invalid command!");
        process.exit(1);
    }
    else {
        if (command.opts().host == null) {
            Logger.error("Host is required!");
            process.exit(1);
        }
        Logger.info("Command executed successfully!");
        startServer(command.opts().port, command.opts().host);
    }
}
catch (err) {
    Logger.error(err.message);
}
