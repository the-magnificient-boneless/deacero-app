const logger = require("../lib/logger"); // Your custom logger

// Middleware to catch all 404 errors
const handle404 = (req, res, next) => {
  const message = `404 Not Found: ${req.method} ${req.originalUrl}`;
  logger.warn(message); // Log the 404 error
  res.status(404).json({
    error: "Resource not found",
    message,
  });
};

module.exports = handle404;
