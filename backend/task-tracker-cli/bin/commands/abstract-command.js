import JsonUtils from "../../utils/JsonUtils.js";
import Task from "../models/task.js";
import Constants from "../constants.js";

export default class AbstractCommand {

    /**
     * @type {Task[]}
     */
    tasks;

    constructor() {
        this.tasks = this.getTasks();
    }

    /**
     * Read JSON database file and return serialized Task list.
     * @return {Task[]}
     */
    getTasks() {
        const json = JsonUtils.getJSONFileData(Constants.JSON_PATH_FILE);
        if(!json.tasks) throw new Error("Unrecognized JSON file!");
        return json.tasks.map(t => Task.deserialize(t));
    }

    /**
     * Write new tasks into JSON database file.
     * @param {Task[]} newTasks
     */
    updateTasks(newTasks) {
        const data = JsonUtils.getJSONFileData(Constants.JSON_PATH_FILE);
        data.tasks = newTasks;
        JsonUtils.updateJSONFileData(Constants.JSON_PATH_FILE, data);
    }

    execute() {
        throw new Error("Not implemented!");
    }
}
