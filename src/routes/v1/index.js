const express = require("express");
const UserRoutes = require("./user-routes");
const { infoController } = require("../../controllers");

const router = express.Router();

router.get("/info", infoController.info);
router.use("/user", UserRoutes);

module.exports = router;
