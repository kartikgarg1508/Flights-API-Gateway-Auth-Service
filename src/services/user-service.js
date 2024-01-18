const { UserRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
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

module.exports = {
  createUser,
};
