import FunctionnalError from "../exceptions/functionnal-error";

export function checkRequiredFields(fields: string[], body: any): boolean {
    for (let field of fields) {
        if (!body[field]) {
            throw new FunctionnalError(`Body field ${field} is required`);
        }
    }
    return true;
}