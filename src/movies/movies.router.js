const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Ensure that the movie exists before trying to get theaters or reviews

const reviewsRouter = require("../reviews/reviews.router");
router.use('/:movieId/reviews', controller.movieExists, reviewsRouter)

const theatersRouter = require("../theaters/theaters.router");
router.use('/:movieId/theaters', controller.movieExists, theatersRouter)

router.route('/:movieId')
    .get(controller.read)
    .all(methodNotAllowed)
router.route('/')
    .get(controller.list)
    .get(methodNotAllowed)

module.exports = router;
