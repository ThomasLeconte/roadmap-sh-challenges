import AbstractCommand from "./abstract-command.js";
import Logger from "../../utils/Logger.js";

export default class UpdateCommand extends AbstractCommand {

    constructor() {
        super();
    }


    execute(taskId, description, status) {
        this.updateTask(this.tasks, taskId, description, status);
    }

    /**
     *
     * @param {Task[]} tasks current tasks
     * @param {number} taskId task id to update
     * @param {string} description new task description (optional)
     * @param {number} status new task status (optional)
     */
    updateTask(tasks, taskId, description, status) {
        let task = tasks.find(t => t.id === taskId);
        if(!task) {
            throw new Error(`Task ${taskId} does not exists!`);
        } else {
            if(description != null) {
                task.updateDesc(description);
            }

            if(status != null) {
                task.updateStatus(status);
            }

            this.updateTasks(tasks);
        }
    }
}