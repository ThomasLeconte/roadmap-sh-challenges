import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "..";
import { UserRequest } from "../utils/user-request";
import User from "../data/models/user";


export function verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.header('Authorization');
    if(!token) {
        return res.status(401).send('Access denied');
    } else {
        if(token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
    
        try {
            const verified = jwt.verify(token, JWT_SECRET);
            (req as UserRequest).userId = parseInt((verified as any).id);
            (req as UserRequest).username = (verified as any).username;
            (req as UserRequest).roles = (verified as any).roles;

            next();
        } catch(err) {
            res.status(400).send('Invalid token');
        }
    }
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
    if((req as UserRequest).roles.includes('ADMIN')) {
        next();
    } else {
        res.status(401).send('Access denied');
    }
}