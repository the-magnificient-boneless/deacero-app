const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const client = require("prom-client");

const register = client.register;
const routesV0 = require("./routes/v0");
const context = require("./middleware/context");
const { handle404 } = require("./middleware");
const { jwtStrategy } = require("./services/authService");
const logger = require("./lib/logger");

const app = express();

// Middleware
app.use(cors());
app.use(context());
// Log and handle 404 errors
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(passport.initialize());
passport.use(jwtStrategy);
// Logging with Morgan
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
// Health Check
app.get("/", (_req, res) => {
  res.status(200).send("🚀 API is running");
});
// Routes
app.use("/api/v0", routesV0);

// Collect default metrics
client.collectDefaultMetrics();
// Expose metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// error-handling middleware to log errors thrown during request handling
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`, err);
  res.status(err.status || 500).json({ message: "An internal error occurred" });
});
app.use(handle404);

// Log uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  //process.exit(1);
});

// Log unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise} reason: ${
      reason instanceof Error ? reason.stack : reason
    }`
  );
});
module.exports = app;
