#! /usr/bin/env node

import * as fs from "node:fs";
import Logger from "../utils/logger.js";
import Task from "./models/task.js";
import JsonUtils from "../data/JsonUtils.js";

const JSON_PATH = './data/tasks-tracker.json'

const argv = process.argv.slice(2);
handleCommand(argv);

/**
 *
 * @param {string[]} args
 */
function handleCommand(args) {
    try {
        validateArgs(args);

        JsonUtils.createJsonFileIfNotExists(JSON_PATH, {tasks: []});
        const tasks = getTasks();

        switch(args[0]) {
            case "list":
                const status = args[1];
                if(status != null) {
                    if(["done", "todo", "in-progress"].find(s => s === status )){
                        listTasksByStatus(tasks, status);
                    } else {
                        throw new Error(`Status of task not recognized. You must use "done", "todo" or "in-progress"`);
                    }
                } else {
                    listTasksByStatus(tasks, "all");
                }
                break;

            case "add":
                const desc = args.slice(1).join(" ");
                const newTask = addTask(tasks, desc);
                tasks.push(newTask);
                updateTasks(tasks);
                Logger.info(`Task added successfully! (ID: ${newTask.id})`)
                break;

            case "update":
            case "delete":
            case "mark-done":
            case "mark-in-progress":

                let taskId = Number.parseInt(args[1]);
                const isValidId = Number.isInteger(taskId);
                if (isValidId) {

                    if(args[0] === "update") {
                        updateTask(tasks, taskId, args.slice(2).join(" "), null);
                        Logger.info(`Task ${task.id} updated successfully!`)
                    } else if (args[0] === "delete") {
                        deleteTask(tasks, taskId);
                        Logger.info(`Task ${taskId} deleted!`)
                    } else if (args[0] === "mark-in-progress") {
                        updateTask(tasks, taskId, null, 1);
                        Logger.info(`Task ${taskId} in progress!`)
                    } else {
                        updateTask(tasks, taskId, null, 2);
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
 *
 * @param tasks current tasks
 * @param taskId task id to update
 * @param description new task description (optional)
 * @param status new task status (optional)
 */
function updateTask(tasks, taskId, description, status) {
    let task = tasks.find(t => t.id === Number.parseInt(taskId));
    if(!task) {
        throw new Error(`Task ${taskId} does not exists!`);
    } else {
        if(description != null) {
            task.updateDesc(description);
        }

        if(status != null) {
            task.updateStatus(status);
        }

        updateTasks(tasks);
    }
}

/**
 *
 * @param {Task[]} tasks
 * @param {number} taskId
 */
function deleteTask(tasks, taskId) {
    let task = tasks.find(t => t.id === Number.parseInt(taskId));
    if(!task) {
        throw new Error(`Task ${taskId} does not exists!`);
    } else {
        tasks = tasks.filter(t => t.id !== taskId);
        updateTasks(tasks);
    }
}

/**
 * @param {Task[]} data
 */
function listTasks(data) {
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
function listTasksByStatus(tasks, status) {
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

    listTasks(filteredTasks);
}

/**
 *
 * @param {Task[]} tasks current tasks
 * @param {string} desc description of new task
 */
function addTask(tasks, desc) {
    if(!desc || desc.length === 0) {
        throw new Error("Description must be provided!")
    }

    let task = new Task(desc);
    task.id = tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;

    return task;
}

/**
 * @throws {Error} args are not valid.
 * @param {string[]} args
 */
function validateArgs(args) {
    if(!args || args.length === 0) {
        throw new Error("You must provide at least one arg")
    }
}

/**
 * Read JSON database file and return serialized Task list.
 * @return {Task[]}
 */
function getTasks() {
    const json = JsonUtils.getJSONFileData(JSON_PATH);
    if(!json.tasks) throw new Error("Unrecognized JSON file!");
    return json.tasks.map(t => Task.deserialize(t));
}

/**
 * Write new tasks into JSON database file.
 * @param {Task[]} newTasks
 */
function updateTasks(newTasks) {
    const data = JsonUtils.getJSONFileData(JSON_PATH);
    data.tasks = newTasks;
    JsonUtils.updateJSONFileData(JSON_PATH, data);
}





