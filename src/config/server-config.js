const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  BOOKING_SERVICE: process.env.BOOKING_SERVICE,
  SEARCH_SERVICE: process.env.SEARCH_SERVICE,
};
