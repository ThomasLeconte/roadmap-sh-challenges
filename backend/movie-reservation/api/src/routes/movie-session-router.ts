import MovieSessionService from "../service/movie-session-service";
import CustomRouter from "./router";
import express from 'express';

const router = new CustomRouter(express.Router());
const movieSessionService = new MovieSessionService();

router.handle('GET', '/', async (req, res) => {
    await movieSessionService.getMovieSessions()
        .then((movieSessions) => {
            res.json(movieSessions);
        });
});

router.handle('GET', '/:id', async (req, res) => {
    await movieSessionService.getMovieSessionById(parseInt(req.params.id))
        .then((movieSession) => {
            res.json(movieSession);
        });
});

router.handle('GET', '/:id/seats-availability', async (req, res) => {
    await movieSessionService.getSeatsAvailability(parseInt(req.params.id))
        .then((seatsAvailability) => {
            res.json(seatsAvailability);
        });
});

router.handle('GET', '/movie/:movieId', async (req, res) => {
    await movieSessionService.getMovieSessionsByMovieId(parseInt(req.params.movieId))
        .then((movieSessions) => {
            res.json(movieSessions);
        });
});

router.handle('POST', '/', async (req, res) => {
    return movieSessionService.createMovieSession(req.body.movieId, req.body.movieRoomId, req.body.startDate, req.body.endDate)
        .then((movieSession) => {
            res.json(movieSession);
        });
}, ["movieId", "movieRoomId", "startDate", "endDate"]);

router.handle('PUT', '/:id', async (req, res) => {
    await movieSessionService.updateMovieSession(parseInt(req.params.id), req.body.movieId, req.body.movieRoomId, req.body.date)
        .then((movieSession) => {
            res.json(movieSession);
        });
}, ["movieId", "movieRoomId", "date"]);

router.handle('POST', '/init', async (req, res) => {
    await movieSessionService.initMovieSessions(req.body.movieId, req.body.startInterval, req.body.endInterval)
        .then((movieSessions) => {
            res.json(movieSessions);
        });
}, ["movieId", "startInterval", "endInterval"]);

export default router._router;