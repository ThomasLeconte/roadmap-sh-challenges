import CartService from "../service/cart-service";
import { UserRequest } from "../utils/user-request";
import CustomRouter from "./router";
import express from "express";

const router = new CustomRouter(express.Router());
const cartService = new CartService();

router.handle('GET', '/', async (req, res) => {
    const userId = (req as unknown as UserRequest).userId;
    return cartService.getCart(userId)
        .then(cart => {
            res.status(200).json(cart);
        });
});

router.handle('POST', '/:productId/add', async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const userId = (req as unknown as UserRequest).userId;
    return cartService.addToCart(productId, userId, quantity)
        .then(product => {
            res.status(200).json(product);
        });
}, ['quantity']);

router.handle('DELETE', '/:productId/remove', async (req, res) => {
    const productId = req.params.productId;
    const userId = (req as unknown as UserRequest).userId;
    return cartService.removeFromCart(productId, userId)
        .then(() => {
            res.status(204).send();
        });
});

router.handle('POST', '/checkout', async (req, res) => {
    const userId = (req as unknown as UserRequest).userId;
    return cartService.checkout(userId).then((result) => {
        res.status(200).json(result);
    })
});

export default router._router;