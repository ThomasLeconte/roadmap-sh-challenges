import express from 'express'
import { verifyToken } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'Protected route'});
});

export default router;