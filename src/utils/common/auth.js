const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function checkPassword(password, hashedPassword) {
  try {
    const response = bcrypt.compareSync(password, hashedPassword);
    return response;
  } catch (error) {
    throw error;
  }
}

function createJwtToken(data) {
  try {
    const token = jwt.sign(data, ServerConfig.SECRET_KEY, {
      expiresIn: ServerConfig.JWT_EXPIRY,
    });
    return token;
  } catch (error) {
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, ServerConfig.SECRET_KEY);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkPassword,
  createJwtToken,
  verifyToken,
};
