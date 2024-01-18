const { AppError } = require("../utils/errors");
const { ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

async function ValidateUser(req, res, next) {
  if (req.body.email && req.body.password) {
    next();
  } else {
    ErrorResponse.message = "Something went wrong while creating the user";
    let explanation = [];

    if (!req.body.email) {
      explanation.push("Email not found in the incoming request");
    }

    if (!req.body.password) {
      explanation.push("Password not found in the incoming request");
    }

    ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
    return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  ValidateUser,
};
