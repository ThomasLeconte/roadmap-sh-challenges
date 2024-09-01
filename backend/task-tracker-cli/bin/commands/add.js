import AbstractCommand from "./abstract-command.js";
import Logger from "../../utils/Logger.js";
import Task from "../models/task.js";

export default class AddCommand extends AbstractCommand {

    constructor() {
        super();
    }

    /**
     *
     * @param {string[]} args
     */
    execute(args) {
        const desc = args.slice(1).join(" ");
        const newTask = this.addTask(this.tasks, desc);
        this.tasks.push(newTask);
        this.updateTasks(this.tasks);
        Logger.info(`Task added successfully! (ID: ${newTask.id})`)
    }

    /**
     *
     * @param {Task[]} tasks current tasks
     * @param {string} desc description of new task
     */
    addTask(tasks, desc) {
        if(!desc || desc.length === 0) {
            throw new Error("Description must be provided!")
        }

        let task = new Task(desc);
        task.id = tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;

        return task;
    }
}