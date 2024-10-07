export default class FunctionnalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FunctionnalError';
    }
}