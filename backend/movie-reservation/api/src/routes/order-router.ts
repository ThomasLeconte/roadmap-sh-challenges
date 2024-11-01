import OrderService from "../service/order-service";
import { UserRequest } from "../utils/user-request";
import CustomRouter from "./router";
import express from "express";

const router = new CustomRouter(express.Router());
const orderService = new OrderService();

router.handle('GET', '/', async (req, res) => {
    const userId = (req as UserRequest).userId;
    await orderService.getOrdersByUserId(userId)
        .then((orders) => {
            res.json(orders);
        });
});

router.handle('POST', '/compute', async (req, res) => {
    const body = req.body;
    await orderService.computeOrder(body)
        .then((order) => {
            res.json(order);
        });
});

router.handle('POST', '/', async (req, res) => {
    const userId = (req as UserRequest).userId;
    await orderService.createOrder(req.body.movieSessionId, userId, req.body.seats)
        .then((order) => {
            res.json(order);
        });
}, ['movieSessionId', 'seats']);

router.handle('GET', '/success', async (req, res) => {
    const token = req.query.token;
    const payerId = req.query.PayerID;
    res.send('Successfully paid with token ' + token + ' and payerId ' + payerId);
});

router.handle('GET', '/cancel', async (req, res) => {
    res.send('Payment cancelled');
});

router.handle('DELETE', '/:id', async (req, res) => {
    const userId = (req as UserRequest).userId;
    await orderService.deleteOrder(Number.parseInt(req.params.id), userId)
        .then(() => {
            res.status(204).send();
        });
});

export default router._router;