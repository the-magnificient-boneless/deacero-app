const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.model("Code", CodeSchema);
