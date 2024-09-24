import ProductService from "../service/product-service";
import CustomRouter from "./router";
import express from "express";

const router = new CustomRouter(express.Router());
const productService = new ProductService();

router.handle('GET', '/', async (req, res) => {
    return productService.getProducts()
        .then(products => {
            res.status(200).json(products);
        });
});

router.handle('GET', '/search', async (req, res) => {
    const query = req.query.q?.toString();
    return productService.searchProducts(query)
        .then(products => {
            res.status(200).json(products);
        });
});

router.handle('GET', '/:id', async (req, res) => {
    const id = req.params.id;
    return productService.getProduct(id)
        .then(product => {
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).send();
            }
        });
});

router.handle('POST', '/', async (req, res) => {
    return productService.createProduct(req.body.name, req.body.description, req.body.price)
        .then(product => {
            res.status(201).json(product);
        });
}, ['name', 'description', 'price']);

export default router._router;