import MovieRoomService from "../service/movie-room-service";
import CustomRouter from "./router";
import express from 'express';

const router = new CustomRouter(express.Router());
const movieRoomService = new MovieRoomService();

router.handle('GET', '/', async (req, res) => {
    await movieRoomService.getMovieRooms()
        .then((movieRooms) => {
            res.json(movieRooms);
        });
});

router.handle('POST', '/', async (req, res) => {
    await movieRoomService.createMovieRoom(req.body.name, req.body.capacity, req.body.rows, req.body.is3d, req.body.is4dx, req.body.isImax, req.body.isDbox)
        .then((movieRoom) => {
            res.json(movieRoom);
        });
}, ["name", "capacity", "is3d", "is4dx", "isImax", "isDbox"]);

router.handle('GET', '/:id', async (req, res) => {
    await movieRoomService.getMovieRoomById(parseInt(req.params.id))
        .then((movieRoom) => {
            res.json(movieRoom);
        });
});

router.handle('PUT', '/:id', async (req, res) => {
    await movieRoomService.updateMovieRoom(parseInt(req.params.id), req.body.name, req.body.capacity)
        .then((movieRoom) => {
            res.json(movieRoom);
        });
}, ["name", "capacity", "is3d", "is4dx", "isImax", "isDbox"]);

router.handle('DELETE', '/:id', async (req, res) => {
    await movieRoomService.deleteMovieRoom(parseInt(req.params.id))
        .then((movieRoom) => {
            res.json(movieRoom);
        });
});

export default router._router;