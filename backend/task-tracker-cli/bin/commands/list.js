import AbstractCommand from "./abstract-command.js";
import Logger from "../../utils/Logger.js";

export default class ListCommand extends AbstractCommand {

    constructor() {
        super();
    }

    /**
     *
     * @param {string[]} args
     */
    execute(args) {
        const status = args[1];
        if(status != null) {
            if(["done", "todo", "in-progress"].find(s => s === status )){
                this.listTasksByStatus(this.tasks, status);
            } else {
                throw new Error(`Status of task not recognized. You must use "done", "todo" or "in-progress"`);
            }
        } else {
            this.listTasksByStatus(this.tasks, "all");
        }
    }

    /**
     * @param {Task[]} data
     */
    listTasks(data) {
        if(data.length === 0) {
            Logger.info("Any tasks registered, coffee time ?")
        }
        data.forEach(task => {
            console.log(`[${task.id}] ${task.description} - ${task.getStatusString()}`);
        })
    }

    /**
     *
     * @param {Task[]} tasks
     * @param {string} status
     */
    listTasksByStatus(tasks, status) {
        let filteredTasks = null;

        switch(status) {
            case "todo":
                filteredTasks = tasks.filter(t => t.status === 0);
                break;
            case "in-progress":
                filteredTasks = tasks.filter(t => t.status === 1);
                break;
            case "done":
                filteredTasks = tasks.filter(t => t.status === 2);
                break;
            case "all":
                filteredTasks = tasks;
                break;
            default:
                throw new Error("Status not recognized!");
        }

        this.listTasks(filteredTasks);
    }
}