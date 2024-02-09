const db = require("../db/connection");
const mapProperties = require('../utils/map-properties');

const tableName = "reviews";

// Convert [critics].critic_id -> 'critic_critic_id' -> {'critic' { 'id': <value> } }
const CRITIC_PROPS = ['critic_id', 'organization_name', 'preferred_name', 'surname', 'created_at', 'updated_at']
const CRITIC_PROPS_AS = CRITIC_PROPS.map(prop => `critics.${prop} as critic_${prop}`);
const CRITIC_PROPS_MAP = Object.fromEntries(CRITIC_PROPS.map(prop => [`critic_${prop}`, `critic.${prop}`]));
const mapCriticProps = mapProperties(CRITIC_PROPS_MAP);

/**
 * Delete the given review by ID
 * @param {number} movie_id 
 */
function destroy(review_id) {
  return db(tableName).where({ review_id }).del();
}

/**
 * List reviews for the given movie, with the properties of the critic included as a subobject
 * @param {number} movie_id 
 */
function list(movie_id) {
  return db("reviews")
  .join(
    "critics",
    "critics.critic_id",
    "reviews.critic_id"
  )
  .where({"reviews.movie_id": movie_id})
  .select("reviews.*", ...CRITIC_PROPS_AS)
  .then(reviews => reviews.map(mapCriticProps))
}

/**
 * Fetch the given review
 * @param {number} review_id 
 * @returns 
 */
function read(review_id) {
  return db(tableName).where({ review_id }).first();
}

/**
 * Fetch the given critic
 * @param {number} critic_id 
 * @returns 
 */
function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

/**
 * Amend the review with the given critic's info (this does not affect the database)
 * @param {object} review 
 * @returns 
 */
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

/**
 * Update the review content, 
 */
function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review)
    .then(() => read(review.review_id))  // re-fetch the review because the db doesn't return the updated data
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
