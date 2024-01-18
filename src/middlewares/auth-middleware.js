const { AppError } = require("../utils/errors");
const { ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");

async function isAuthenticated(req, res, next) {
  if (!req.headers["x-access-token"]) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = new AppError(
      "x-access token missing",
      StatusCodes.BAD_REQUEST
    );
    return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
  }

  try {
    await UserService.isAuthenticated(req.headers["x-access-token"]);
    next();
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  isAuthenticated,
};
