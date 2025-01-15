const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const secretKey = process.env.JWT_SECRET || "Noentras08$"; // Replace with your secret key
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // AES-256 requires a 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector

// Function to generate a JWT
const encrypt = (payload) => {
  // Check if payload is a string and parse it
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload); // Convert stringified JSON to an object
    } catch (error) {
      throw new Error("Invalid JSON string provided as payload.");
    }
  }

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be a non-null object.");
  }

  // Sign the token with the payload and secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: "365d" }); // Token expires in 1 year
  return token;
};

// Function to verify a JWT
const decrypt = (token) => {
  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, secretKey);
    return decoded; // Returns the decoded payload
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null; // Return null if verification fails
  }
};

// Encrypt
const encryptCode = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt
const decryptCode = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
module.exports = {
  encrypt,
  decrypt,
  encryptCode,
  decryptCode,
};
