import fs from "node:fs";

export default class JsonUtils {
    /**
     *
     * @param {any} data
     * @return {object}
     */
    static parseJSONFile(data: any) {
        try {
            return JSON.parse(data);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Create directory if not exists
     * @param path {string}
     */
    static createDirIfNotExists(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    /**
     *
     * @param path {string}
     * @param defaultValue {object}
     */
    static createJsonFileIfNotExists(path: string, defaultValue: any) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(defaultValue, null, 2));
        }
    }

    /**
     * Read json file and return parsed object
     * @param {string} path
     * @return {object}
     */
    static getJSONFileData(path: string) {
        try {
            const data = fs.readFileSync(path);
            return JsonUtils.parseJSONFile(data);
        } catch (err) {
            throw err;
        }
    }


    /**
     * @param {string} path
     * @param {object} data
     * @return {object}
     */
    static updateJSONFileData(path: string, data: any) {
        fs.writeFile(path, JSON.stringify(data), "utf-8", (err) => {
            if(err) {
                throw err;
            }
        })
    }
}
