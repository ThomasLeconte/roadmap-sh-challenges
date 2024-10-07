import { Router as ExpressRouter, Request, Response, NextFunction } from "express";
import { checkRequiredFields } from "../utils/api-utils";
import manageError from "../utils/error-manager";

export default class CustomRouter {
    _router: ExpressRouter;
    constructor(router: ExpressRouter) {
        this._router = router;
    }

    public handle(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', target: string, fn: (req: Request, res: Response, next: NextFunction) => Promise<any>, requiredFields?: string[]) :void {
        if(requiredFields != null && requiredFields.length > 0 && ['GET', 'DELETE'].includes(method)) {
            throw new Error('GET and DELETE methods cannot have required fields');
        }

        (this._router as any)[method.toLowerCase()](target, async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (requiredFields) {
                    checkRequiredFields(requiredFields, req.body);
                }
                await fn(req, res, next);
            } catch (err) {
                manageError(err, res);
            }
        });
    }
}