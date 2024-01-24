const { UserRepository, RoleRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { Auth,Enums } = require("../utils/common");

const userrepository = new UserRepository();
const rolerepository = new RoleRepository();
const { CUSTOMER } = Enums.USER_ROLES;

async function createUser(data) {
  try {
    const user = await userrepository.create(data);
    const role = await rolerepository.getRole(CUSTOMER);
    await user.addRole(role);
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

async function isAuthenticated(token) {
  try {
    const response = Auth.verifyToken(token);
    // this is done to check if user is deleted
    const user = await userrepository.get(response.id);
    return user.id;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND)
      throw new AppError("User not found", error.statusCode);

    if (error.name === "JsonWebTokenError")
      throw new AppError("Invalid JWT Token", StatusCodes.BAD_REQUEST);

    if (error.name === "TokenExpiredError")
      throw new AppError("Token has expired", StatusCodes.BAD_REQUEST);

    throw new AppError(
      "Not able to authenticate",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
  signin,
  isAuthenticated,
};
