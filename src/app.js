if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors")
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

try {
    const morgan = require("morgan");
    app.use(morgan('dev'));
} catch (err) {
    // console.warn(err);
}

app.use(cors());
app.use(express.json()) // the omission of this makes request.body vanish
app.use('/movies', moviesRouter);
app.use('/theaters', theatersRouter);
app.use('/reviews', reviewsRouter);

/** 
 * Not Found
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 **/
app.use((request, response, next) => {
    return next({
        status: 404,
        message: `Not found: ${request.originalUrl}`
      });
  });

/** Error 
 * @param {any} err
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 **/
app.use((error, request, response, next) => {
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).json({ error: message });
})

module.exports = app;
