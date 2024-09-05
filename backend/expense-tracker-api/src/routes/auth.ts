import fs from 'fs';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from '../data/repository/user-repository';
import User from '../data/models/user';
import { JWT_SECRET } from '..';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {username, password, email} = req.body;
        if(!username || !password || !email) {
            return res.status(400).send('Invalid username or password or email');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = new User(0, username, hashedPassword, email, new Date());
        user = await new UserRepository().save(user);
        res.status(201).send(user);
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
})

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) {
            return res.status(400).send('Invalid username or password');
        }
    
        const user = await new UserRepository().findByUsername(username);
        if(!user) {
            return res.status(404).send('User not found');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }
    
        const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '1h' });
    
        res.status(200).send({token});
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
})

export default router;