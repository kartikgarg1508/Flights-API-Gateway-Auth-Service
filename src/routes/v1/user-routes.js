const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const router = express.Router();

/* POST /api/v1/user/signup

req-body {
    email: abc@gmail.com
    password: Abc@12345
}

*/

router.post(
  "/signup",
  UserMiddleware.ValidateCreateUser,
  UserController.signup
);

module.exports = router;
