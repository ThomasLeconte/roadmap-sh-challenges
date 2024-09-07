import { Request, Response, NextFunction } from "express";

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
    const startDate = new Date();

    res.on('finish', () => {
        const finishDate = new Date();
        const timeDiff = finishDate.getTime() - startDate.getTime();
        console.log(`[${finishDate.toLocaleDateString()} - ${finishDate.toLocaleTimeString()}] - [${req.method}] ${req.originalUrl} ${res.statusCode} (${timeDiff}ms)`);
    });

    
    

    next();
}