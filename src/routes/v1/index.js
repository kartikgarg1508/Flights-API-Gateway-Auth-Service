const express = require("express");
const UserRoutes = require("./user-routes");
const { infoController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.get("/info", AuthMiddleware.isAuthenticated,infoController.info);
router.use("/user", UserRoutes);

module.exports = router;
