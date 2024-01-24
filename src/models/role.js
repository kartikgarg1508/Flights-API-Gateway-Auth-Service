"use strict";
const { Model } = require("sequelize");
const { Enums } = require("../utils/common");
const { CUSTOMER, FLIGHT_COMPANY, ADMIN } = Enums.USER_ROLES;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [CUSTOMER, FLIGHT_COMPANY, ADMIN],
        defaultValue: CUSTOMER,
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
