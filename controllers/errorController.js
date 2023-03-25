const AppError = require("../utilities/appError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);

    if (error.name === "CastError") error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    if (error.name === "ValidationError") error = handleValidationErrorDB(err);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  // Operational error, send error to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming error, only send in development, don't leak error details to the client

    // 1. Log the error
    console.error("ERROR", err);

    // 2. Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const message = `Duplicate field value: ${err.keyValue.name}`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errorMessages = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  const message = `Invalid input data: ${errorMessages}`;

  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError("Invalid token, please log in again", 401);
}

function handleJWTExpiredError() {
  return new AppError("You're login has expired, please login again", 401);
}
