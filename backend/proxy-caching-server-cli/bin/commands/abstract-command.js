import Expense from "../models/Expense.js";
import Constants from "../utils/constants.js";
import JsonUtils from "../utils/json-utils.js";
export default class AbstractCommand {
    constructor() {
        this.expenses = this.getExpenses();
    }
    /**
     * Read JSON database file and return serialized Task list.
     * @return {Expense[]}
     */
    getExpenses() {
        const json = JsonUtils.getJSONFileData(Constants.JSON_PATH_FILE);
        if (!json.expenses)
            throw new Error("Unrecognized JSON file!");
        return json.expenses.map((t) => Expense.deserialize(t));
    }
    /**
     * Write new expenses into JSON database file.
     * @param {Expense[]} newExpenses
     */
    updateExpenses(newExpenses) {
        const data = JsonUtils.getJSONFileData(Constants.JSON_PATH_FILE);
        data.expenses = newExpenses;
        JsonUtils.updateJSONFileData(Constants.JSON_PATH_FILE, data);
    }
}
