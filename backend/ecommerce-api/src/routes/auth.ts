import express from 'express';
import { checkRequiredFields } from '../utils/api-utils';
import AuthService from '../service/auth-service';
import manageError from '../utils/error-manager';

const router = express.Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
    const {username, password, email} = req.body;
    checkRequiredFields(['username', 'password', 'email'], req.body);

    authService.register(username, password, email)
        .then((user) => {
            res.status(201).json(user);
        }).catch((err) => {
            manageError(err, res);
        });
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    checkRequiredFields(['username', 'password'], req.body);

    authService.login(username, password)
        .then((token) => {
            res.status(200).send({token});
        }).catch((err) => {
            manageError(err, res);
        });
})

export default router;