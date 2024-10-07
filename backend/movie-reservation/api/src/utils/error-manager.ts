import ForbiddenError from "../exceptions/forbidden-error";
import FunctionnalError from "../exceptions/functionnal-error";
import NotFoundError from "../exceptions/not-found-error";
import { Response } from "express";

export default function manageError (err: any, res: Response) {
    if(!res.headersSent) {
        if(err instanceof NotFoundError) {
            res.status(404).send(err.message);
            return;
        } else if (err instanceof ForbiddenError) {
            res.status(403).send(err.message);
            return;
        } else if (err instanceof FunctionnalError) {
            res.status(400).send(err.message);
            return;
        } else {
            console.error('Internal server error', err);
            res.status(500).send('Internal server error');
        }
    } else {
        console.error('Error while sending response', err);
    }
}