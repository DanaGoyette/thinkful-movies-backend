const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

/**
 * If a movie ID is supplied, list only the theaters that are playing that movie.
 * If movie ID is not supplied, list all theaters, and include each theater's list of movies.
 * @param {number} movie_id 
 */
function list(movie_id=undefined) {
  if (movie_id) {
    return db("theaters")
      .join(
        "movies_theaters",
        "movies_theaters.theater_id",
        "theaters.theater_id"
      )
      .where({"movies_theaters.movie_id": movie_id})
      .select("theaters.*")
  } else {
    return db("theaters")
      .join(
        "movies_theaters",
        "movies_theaters.theater_id",
        "theaters.theater_id"
      )
      .join("movies", "movies.movie_id", "movies_theaters.movie_id")
      .then(reduceMovies);
  }
}

module.exports = {
  list,
};
