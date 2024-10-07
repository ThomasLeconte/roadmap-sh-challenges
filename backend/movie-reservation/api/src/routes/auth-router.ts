import express from 'express';
import { checkRequiredFields } from '../utils/api-utils';
import AuthService from '../service/auth-service';
import CustomRouter from './router';

const router = new CustomRouter(express.Router());
const authService = new AuthService();


router.handle('POST', '/register', async (req, res, next) => {
    const {username, password, email} = req.body;
    return authService.register(username, password, email)
        .then((user) => {
            res.status(201).json(user);
        });
}, ['username', 'password', 'email']);

router.handle('POST', '/login', async (req, res) => {
    const {username, password} = req.body;

    return authService.login(username, password)
        .then((token) => {
            res.status(200).send({token});
        });
}, ['username', 'password']);

router.handle('POST', '/refresh-token', async (req, res) => {
    const {token} = req.body;

    return authService.refreshToken(token)
        .then((newToken) => {
            res.status(200).send({token: newToken});
        });
}, ['token']);

export default router._router;