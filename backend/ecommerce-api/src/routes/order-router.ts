import CartService from "../service/cart-service";
import OrderService from "../service/order-service";
import CustomRouter from "./router";
import express from "express";

const router = new CustomRouter(express.Router());
const orderService = new OrderService();
const cartService = new CartService();

router.handle('GET', '/pay', async (req, res) => {
    const paymentIntentId = req.query.payment_intent;
    if(!paymentIntentId) {
        res.status(400).send();
        return;
    }
    return orderService.payOrder(paymentIntentId.toString()).then((user) => {
        return cartService.clearCart(user.id).then(() => {
            res.status(200).send();
        });
    })
});

export default router._router;