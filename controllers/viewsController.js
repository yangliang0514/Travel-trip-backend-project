const { render } = require("pug");
const AppError = require("../utilities/appError");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utilities/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. GET tour data from collection
  const tours = await Tour.find();
  // 2. Build template

  // 3. Render template using the tour data from step 1
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get data for the requested tour (including reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    next(new AppError("There's no tour with that name", 404));
    return;
  }

  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. find all bookings by the user ID
  const bookings = await Booking.find({ user: req.user.id });

  // 2. find tours with the returned IDs
  const tourIDs = bookings.map((booking) => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account!",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
