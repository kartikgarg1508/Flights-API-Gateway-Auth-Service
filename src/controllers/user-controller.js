const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

async function signup(req, res) {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    const user = await UserService.createUser(data);
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function signin(req, res) {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const jwtToken = await UserService.signin(data);
    SuccessResponse.data = { jwtToken: jwtToken };
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function addUserRole(req, res) {
  try {
    const data = {
      email: req.body.email,
      rolename: req.body.rolename,
    };

    const user = await UserService.addUserRole(data);
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  signup,
  signin,
  addUserRole,
};
