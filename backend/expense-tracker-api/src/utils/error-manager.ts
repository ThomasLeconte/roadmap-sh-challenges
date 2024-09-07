import NotFoundError from "../exceptions/not-found-error";

export default function manageError (err: any, res: any) {
    if(err instanceof NotFoundError) {
        res.status(404).send(err.message);
        return;
    } else {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}