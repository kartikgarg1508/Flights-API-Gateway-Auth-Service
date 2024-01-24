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
    const response = await UserService.isAuthenticated(
      req.headers["x-access-token"]
    );
    if (response) {
      req.userId = response;
      next();
    }
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function isAdmin(req, res, next) {
  try {
    const response = await UserService.isAdmin(req.userId);
    if (!response) {
      throw new AppError(
        "Not Permitted to do the requested action as you are not an Admin",
        StatusCodes.UNAUTHORIZED
      );
    }
    next();
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
};
