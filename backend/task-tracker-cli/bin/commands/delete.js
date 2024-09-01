import AbstractCommand from "./abstract-command.js";
import Logger from "../../utils/Logger.js";

export default class DeleteCommand extends AbstractCommand {

    constructor() {
        super();
    }

    execute(taskId) {
        this.deleteTask(this.tasks, taskId);
        Logger.info(`Task ${taskId} deleted!`)
    }

    /**
     *
     * @param {Task[]} tasks
     * @param {number} taskId
     */
    deleteTask(tasks, taskId) {
        let task = tasks.find(t => t.id === taskId);
        if(!task) {
            throw new Error(`Task ${taskId} does not exists!`);
        } else {
            tasks = tasks.filter(t => t.id !== taskId);
            this.updateTasks(tasks);
        }
    }
}