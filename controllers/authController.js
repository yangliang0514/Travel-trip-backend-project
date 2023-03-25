const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");
const sendMail = require("./../utilities/email");
const { decode } = require("punycode");
const crypto = require("crypto");

exports.signup = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    next(new AppError("Please provide email and password", 400));
    return;
  }

  // 2. Check if email and password are correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError("Incorrect email or password", 401));
    return;
  }

  // 3. If everything is ok, send token to the user
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async function (req, res, next) {
  let token;
  // 1. Getting the token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    next(
      new AppError("You are not logged in, Please login to get access", 401)
    );
    return;
  }
  // 2.Verifify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    next(new AppError("The user no longer exists", 401));
    return;
  }

  // 4. Check if the user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    next(new AppError("Password has been changed, please login again", 401));
    return;
  }

  // Allow access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    // roles in this function is an array that includes types of users
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
      return;
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new AppError("There is no user with this email address", 404));
    return;
  }

  // 2. Create the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to the user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: "You're password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    next(
      new AppError("There was an error sending the email, try again later", 500)
    );
    return;
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // 2. Set the new password, if token hasn't expire && user exists
  if (!user) {
    next(new AppError("Token is invalid or expired", 400));
    return;
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // 3. Update passwordChangedAt protperty for the user

  // 4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user
  const user = await User.findById(req.user._id).select("+password");

  // 2. Check if the POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    next(new AppError("You're current password is incorrect", 401));
    return;
  }
  // 3. Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "development") cookieOptions.secure = undefined;

  res.cookie("jwt", token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      user,
    },
  });
}

// Only for rendering pages, so there will be no errors
exports.isLoggedIn = catchAsync(async function (req, res, next) {
  if (!req.cookies.jwt) return next();

  // 1. Verifies the token
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // 2. Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next();

  // 3. Check if the user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) return next();

  // 4. There is a logged in user
  res.locals.user = currentUser;

  next();
});
