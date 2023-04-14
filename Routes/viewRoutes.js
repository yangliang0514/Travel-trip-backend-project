const express = require("express");
const viewsController = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();

module.exports = router;

router.use(authController.isLoggedIn);

router.get("/me", authController.protect, viewsController.getAccount);
router.get("/tour/:slug", viewsController.getTour);
router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.getLoginForm);
