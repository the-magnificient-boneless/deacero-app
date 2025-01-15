// models/RequestLog.js
const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    headers: { type: Object, required: true },
    parameters: { type: Object, required: true },
    query: { type: Object, required: true },
    body: { type: Object },
  },
  { timestamps: true }
);

// Create a compound index to ensure uniqueness based on specific fields
requestLogSchema.index(
  { endpoint: 1, method: 1, parameters: 1, query: 1 },
  { unique: true }
);

module.exports = mongoose.model("RequestLog", requestLogSchema);
