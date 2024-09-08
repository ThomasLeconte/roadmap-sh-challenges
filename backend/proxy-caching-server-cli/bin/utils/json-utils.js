import fs from "node:fs";
export default class JsonUtils {
    /**
     *
     * @param {any} data
     * @return {object}
     */
    static parseJSONFile(data) {
        try {
            return JSON.parse(data);
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * Create directory if not exists
     * @param path {string}
     */
    static createDirIfNotExists(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
    /**
     *
     * @param path {string}
     * @param defaultValue {object}
     */
    static createJsonFileIfNotExists(path, defaultValue) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(defaultValue, null, 2));
        }
    }
    /**
     * Read json file and return parsed object
     * @param {string} path
     * @return {object}
     */
    static getJSONFileData(path) {
        try {
            const data = fs.readFileSync(path);
            return JsonUtils.parseJSONFile(data);
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * @param {string} path
     * @param {object} data
     * @return {object}
     */
    static updateJSONFileData(path, data) {
        fs.writeFile(path, JSON.stringify(data), "utf-8", (err) => {
            if (err) {
                throw err;
            }
        });
    }
}
