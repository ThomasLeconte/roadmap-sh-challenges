import MovieService from "../service/movie-service";
import CustomRouter from "./router";
import express from 'express';

const router = new CustomRouter(express.Router());
const movieService = new MovieService();


router.handle('GET', '/', async (req, res) => {
    await movieService.searchMovies((req.query?.q as string))
        .then((movies) => {
            res.json(movies);
        });
});

router.handle('GET', '/:id', async (req, res) => {
    await movieService.getMovieById(parseInt(req.params.id))
        .then((movie) => {
            res.json(movie);
        });
});

router.handle('POST', '/', async (req, res) => {
    await movieService.createMovie(req.body.title, req.body.description, req.body.releaseDate, req.body.duration, req.body.image)
        .then((movie) => {
            res.json(movie);
        });
}, ['title', 'description', 'duration', 'releaseDate']);

export default router._router;