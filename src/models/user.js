"use strict";
const { Model } = require("sequelize");
const { ServerConfig } = require("../config");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email provided is not a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
            msg: "Password should be of length atleast 8 and atmax 12 including atleast 1 uppercase, 1 lowercase, 1 number , 1 special character",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hashSync(
      user.password,
      Number(ServerConfig.SALT_ROUNDS)
    );
    user.password = hashedPassword;
  });

  return User;
};
