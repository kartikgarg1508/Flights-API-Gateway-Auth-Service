const { UserRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { Auth } = require("../utils/common");
const userrepository = new UserRepository();

async function createUser(data) {
  try {
    const user = await userrepository.create(data);
    return user;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError")
      throw new AppError(
        "There already exists a User with this email",
        StatusCodes.BAD_REQUEST
      );

    if (error.name === "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((element) => {
        explanation.push(element.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Cannot create a new User",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userrepository.findUser(data.email);
    if (!Auth.checkPassword(data.password, user.password)) {
      throw new AppError("Incorrect Password", StatusCodes.BAD_REQUEST);
    }
    const jwtToken = Auth.createJwtToken({
      id: user.id,
      email: user.email,
    });
    return jwtToken;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND)
      throw new AppError(
        "No registered user exists with the given email",
        error.statusCode
      );

    if (error.statusCode === StatusCodes.BAD_REQUEST)
      throw new AppError("Incorrect Password", error.statusCode);

    throw new AppError(
      "Not able to Sign In",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
  signin,
};
