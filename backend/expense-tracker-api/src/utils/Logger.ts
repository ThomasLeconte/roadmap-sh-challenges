export class Logger {
    static info (message: string, prefix = true) {
        console.log(`${prefix ? '[Expense-tracker] ' : ''}${message}`);
    }

    static error (message: string, prefix = true) {
        this.info(`\x1b[31m${message}\x1b[0m`, prefix)
    }

    static warning (message: string, prefix = true) {
        this.info(`\x1b[33m${message}\x1b[0m`, prefix)
    }

    static success (message: string, prefix = true) {
        this.info(`\x1b[32m${message}\x1b[0m`, prefix)
    }
}