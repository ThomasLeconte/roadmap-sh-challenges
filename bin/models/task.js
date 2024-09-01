export default class Task {
    /**
     * @type {number}
     */
    id;
    /**
     * @type {string}
     */
    description;
    /**
     * @type {number}
     */
    status;
    /**
     * @type {Date}
     */
    createdAt;
    /**
     * @type {Date}
     */
    updatedAt;

    constructor(description) {
        this.status = 0;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.description = description;
    }

    complete() {
        this.status = 2;
        this.updatedAt = new Date();
    }

    reset() {
        this.status = 0;
        this.updatedAt = new Date();
    }

    updateDesc(description) {
        this.description = description;
        this.updatedAt = new Date();
    }

    getStatusString() {
        switch (this.status) {
            case 0:
                return 'Pending';
            case 1:
                return 'In Progress';
            case 2:
                return 'Completed';
            default:
                return 'Unknown';
        }
    }

    /**
     *
     * @param status {number}
     */
    updateStatus(status) {
        this.status = status;
        this.updatedAt = new Date();
    }

    static deserialize(data) {
        const task = new Task(data.description);
        task.id = data.id;
        task.status = data.status;
        task.createdAt = new Date(data.createdAt);
        task.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        return task;
    }
}