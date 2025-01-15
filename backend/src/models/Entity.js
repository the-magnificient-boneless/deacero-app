const mongoose = require("mongoose");

const EntitySchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

const CreateModel = (collectionName) => {
  return mongoose.model(collectionName, EntitySchema, collectionName);
};

module.exports = CreateModel;
