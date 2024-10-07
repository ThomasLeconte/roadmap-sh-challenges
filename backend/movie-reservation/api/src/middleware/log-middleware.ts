import { Request, Response, NextFunction } from "express";

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
    const startDate = new Date();

    res.on('finish', () => {
        const finishDate = new Date();
        const timeDiff = finishDate.getTime() - startDate.getTime();
        const potentialUser = (req as any).username ? (req as any).username : 'anonymous';
        console.log(`[${finishDate.toLocaleDateString()} - ${finishDate.toLocaleTimeString()}]`,
            `- [${potentialUser}]`,
            `- ${computeMethodLog(req.method)}`,
            `${req.originalUrl}`,
            `${res.statusCode} (${timeDiff}ms)`);
    });


    const computeMethodLog = (method: string) => {
        switch(method) {
            case 'POST':
                return `\x1b[32m[POST]\x1b[0m`;
            case 'GET':
                return `\x1b[34m[GET]\x1b[0m`;
            case 'PUT':
                return `\x1b[33m[PUT]\x1b[0m`;
            case 'DELETE':
                return `\x1b[31m[DELETE]\x1b[0m`;
            default:
                return `[${method}]`;
        }
    }

    next();
}