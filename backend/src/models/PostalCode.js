const mongoose = require("mongoose");

const PostalCodeSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("PostalCode", PostalCodeSchema, "postalcodes");
