const CrudRepository = require("./crud-repository");
const { Role } = require("../models");

class RoleRepository extends CrudRepository {
  constructor() {
    super(Role);
  }

  async getRole(name) {
    const response = await this.model.findAll({
      where: {
        name: name,
      },
    });
    return response;
  }
}

module.exports = RoleRepository;
