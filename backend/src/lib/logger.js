const { createLogger, format, transports } = require("winston");
const LokiTransport = require("winston-loki"); // Import Loki transport
const { combine, timestamp, printf, errors } = format;
const client = require("prom-client");

// Prometheus counters
const infoCounter = new client.Counter({
  name: "log_info_total",
  help: "Total number of info level logs",
});

const errorCounter = new client.Counter({
  name: "log_error_total",
  help: "Total number of error level logs",
});

const warnCounter = new client.Counter({
  name: "log_warn_total",
  help: "Total number of warn level logs",
});

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logWithMetrics = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new LokiTransport({
      host: "http://localhost:3100", // Loki server URL
      labels: { job: "winston-logger" }, // Add labels for querying logs
      onError: (err) => console.error("Error sending log to Loki:", err),
    }),
  ],
});

module.exports = {
  info: (message) => {
    infoCounter.inc();
    logWithMetrics.info(message);
  },
  error: (message) => {
    errorCounter.inc();
    logWithMetrics.error(message);
  },
  warn: (message) => {
    warnCounter.inc();
    logWithMetrics.warn(message);
  },
};
