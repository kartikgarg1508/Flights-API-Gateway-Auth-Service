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

router.post("/signup", UserMiddleware.ValidateUser, UserController.signup);

/* POST /api/v1/user/signin

req-body {
    email: abc@gmail.com
    password: Abc@12345
}

*/

router.post("/signin", UserMiddleware.ValidateUser, UserController.signin);

module.exports = router;