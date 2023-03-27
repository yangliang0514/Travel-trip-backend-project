const express = require("express");
const viewsController = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();

module.exports = router;

router.get("/me", authController.protect, viewsController.getAccount);
router.get("/tour/:slug", authController.protect, viewsController.getTour);

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.getLoginForm);