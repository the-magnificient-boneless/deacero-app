const mongoose = require("mongoose");
const User = require("../models/User"); // Import the User model
const hash = require("../utils/hash");

//TODO: manage dependencies in context
//TODO: decide if using a middleware or context for utils or dependencies
const createContext = () => {
  return async (req, res, next) => {
    try {
      if (!mongoose.connection.readyState) {
        // Update the MongoDB URI to use the Docker Compose service name 'mongo'
        await mongoose.connect("mongodb://mongo:27017/alfred-db", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
      }
      req.context = {
        db: { connection: mongoose.connection, models: { user: User } },
        config: {
          apiKey: "",
          jwtSecret: process.env.JWT_SECRET || "Noentras08$",
          jwtExpiration: process.env.JWT_EXPIRATION || "1h",
        },
        utils: {
          hash, // Directly include the hash object containing encrypt and decrypt
        },
      };
      next();
    } catch (err) {
      console.error("Failed to connect to the database", err);
      res.status(500).send("Database connection error");
    }
  };
};

module.exports = createContext;
