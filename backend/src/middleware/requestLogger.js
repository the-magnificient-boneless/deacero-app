// middleware/requestLogger.js
const RequestLog = require("../models/RequestLog");

const requestLogger = async (req, res, next) => {
  // Collect data about the request
  const logData = {
    endpoint: req.originalUrl,
    method: req.method,
    headers: req.headers,
    parameters: req.params,
    query: req.query,
    body: req.body,
  };

  try {
    // Save log data to MongoDB
    await RequestLog.create(logData);
    console.log(`Logged request to ${req.originalUrl}`);
  } catch (error) {
    // Handle duplicate key error (E11000) gracefully
    if (error.code === 11000) {
      console.log(
        `Duplicate request log detected for ${req.originalUrl} - skipping log`
      );
    } else {
      console.error(`Error logging request: ${error}`);
    }
  }

  next(); // Continue to the next middleware or route handler
};

module.exports = requestLogger;
