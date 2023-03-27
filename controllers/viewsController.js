const { render } = require("pug");
const AppError = require("../utilities/appError");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utilities/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. GET tour data from collection
  const tours = await Tour.find();
  // 2. Build template

  // 3. Render template using the tour data from step 1
  res.status(200).render("overview", {
    title: "All tours",
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
