const express = require("express"); // used only for types

const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List the theaters (the service is responsible for merging the list of movies)
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
async function list(request, response) {
  const { movieId } = response.locals;
  const data = await service.list(movieId);
  response.json({ data })
}

module.exports = {
  list: asyncErrorBoundary(list),
};
