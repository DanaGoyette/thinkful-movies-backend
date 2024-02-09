const express = require("express"); // used only for types

const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * If the movie exists, stash it in locals, otherwise report the failure with a 404.
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function movieExists(request, response, next) {
  // Save the movie ID and movie so it's easy for the handler to use them.
  const movieId = Number(request.params.movieId)
  response.locals.movieId = movieId;
  const foundMovie = await service.read(movieId);
  if (foundMovie) {
    response.locals.foundMovie = foundMovie;
    next()
  } else {
    next({
      status: 404,
      message: `Movie cannot be found: ${movieId}`
    });
  }
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 */
function read(request, response) {
  const { foundMovie } = response.locals;
  response.json({ data: foundMovie });
}

/**
 * List all movies, optionally filtering to those that are showing
 * @param {express.Request} request
 * @param {express.Response} response
 */
async function list(request, response) {
  // Pass ?is_showing from the URL query to the database query.  Treat ?is_showing the same as ?is_showing=true
  const is_showing = request.query.is_showing || request.query.is_showing === ''
  const data = await service.list(is_showing);
  response.json({ data });
}

module.exports = {
  movieExists,
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read]
};
