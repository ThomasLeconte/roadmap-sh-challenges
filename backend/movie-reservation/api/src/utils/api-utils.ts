import FunctionnalError from "../exceptions/functionnal-error";

export function checkRequiredFields(fields: string[], body: any): boolean {
    let missingFields = [];
    for (let field of fields) {
        if (!body[field]) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) throw new FunctionnalError(`Missing required fields: ${missingFields.join(', ')}`);

    return true;
}