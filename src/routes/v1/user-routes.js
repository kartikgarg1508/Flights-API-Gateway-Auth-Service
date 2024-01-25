const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware, AuthMiddleware } = require("../../middlewares");
const router = express.Router();

/* POST /api/v1/user/signup

req-body {
    email: abc@gmail.com
    password: Abc@12345
}

*/

router.post("/signup", UserMiddleware.ValidateUser, UserController.signup);

/* POST /api/v1/user/signin

req-body {
    email: abc@gmail.com
    password: Abc@12345
}

*/

router.post("/signin", UserMiddleware.ValidateUser, UserController.signin);

/* POST /api/v1/user/role

req-body {
    email: abc@gmail.com
    rolename: Admin/Flight-Company/Customer
}

*/

router.post(
  "/role",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdmin,
  UserMiddleware.ValidateAddRole,
  UserController.addUserRole
);

module.exports = router;
