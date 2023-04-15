const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// this route is only used to getting the checkout-sessions
router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingController.getSession
);

module.exports = router;
