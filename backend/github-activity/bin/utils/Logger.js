export class Logger {
    static info(message, prefix = true) {
        console.log(`${prefix ? '[Tasks-cli] ' : ''}${message}`);
    }
    static error(message, prefix = true) {
        this.info(`\x1b[31m${message}\x1b[0m`, prefix);
    }
    static warning(message, prefix = true) {
        this.info(`\x1b[33m${message}\x1b[0m`, prefix);
    }
    static success(message, prefix = true) {
        this.info(`\x1b[32m${message}\x1b[0m`, prefix);
    }
}
