const express = require("express"); // used only for types

const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function reviewExists(request, response, next) {
  const reviewId = Number(request.params.reviewId);
  response.locals.reviewId = reviewId;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    response.locals.foundReview = foundReview
    next();
  } else {
    next({ 
      status: 404, 
      message: `Review cannot be found: ${reviewId}`
    });
  }
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function destroy(request, response) {
  const reviewId = Number(request.params.reviewId);
  await service.destroy(reviewId);
  response.sendStatus(204);
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function list(request, response) {
  const movieId = Number(request.params.movieId);
  const data = await service.list(movieId);
  response.json({ data });
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function update(request, response) {
  const { data = {} } = request.body
  const { reviewId, foundReview } = response.locals;
  const combinedData = {
    ...foundReview,
    ...data,
    review_id: reviewId
  }
  const result = await service.update(combinedData);
  response.json({ data: result })
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
