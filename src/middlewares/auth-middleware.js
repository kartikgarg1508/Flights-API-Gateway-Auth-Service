const { AppError } = require("../utils/errors");
const { ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { Enums } = require("../utils/common");
const { ServerConfig } = require("../config");
const { FLIGHT_COMPANY, ADMIN } = Enums.USER_ROLES;

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
    const response = await UserService.checkUserHasRole(req.userId, ADMIN);
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

async function checkFlightCreation(req, res, next) {
  try {
    if (
      req.method !== "POST" ||
      req.originalUrl !== ServerConfig.FLIGHT_CREATION_ROUTE
    ) {
      next();
    } else {
      const response = await UserService.checkUserHasRole(
        req.userId,
        FLIGHT_COMPANY
      );
      if (!response) {
        throw new AppError(
          "Not Permitted to create the flight as you are not the flight company",
          StatusCodes.UNAUTHORIZED
        );
      }
      next();
    }
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  checkFlightCreation,
};
