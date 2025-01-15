const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // Asegura que "email" sea único
  },
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
