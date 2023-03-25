const User = require("./../models/userModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const factory = require("./handlerFactory");

// For the current user to update his own data
exports.updateMe = catchAsync(async function (req, res, next) {
  // 1. Create an error if user POSTs a password data
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        "This route is not for password updates, please use /updateMyPassword",
        400
      )
    );
    return;
  }
  // 2. Filter out unwanted fields that are not allowed to be updated
  const filteredData = filterObject(req.body, "name", "email");

  // 3. Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = function (request, response) {
  response.status(500).json({
    status: "error",
    message: "This route is not defined. Please use signup instead",
  });
};

// Don't update password with this updateUser function (only for admin to use)
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

// Helper functions
function filterObject(obj, ...allowedFields) {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
}
