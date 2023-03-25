const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);

mongoose.connect(DB, (err) => {
  console.log(
    `MongoDB Connect (0-disconnected; 1-connected; 2-connecting; 3-disconnecting; 4-invalid credentials) STATUS  --> ${mongoose.connection.readyState}`
  );

  if (err) throw err;
});

const app = require("./app");

// console.log(process.env);

// Start server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${process.env.PORT}!`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
