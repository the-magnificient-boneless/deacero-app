const mongoose = require("mongoose");

const DashboardSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("Dashboard", DashboardSchema);
