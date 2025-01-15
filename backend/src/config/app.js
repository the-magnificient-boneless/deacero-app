module.exports = {
  app: {
    apiKey: "APIKEY1234567890",
    jwtSecret: process.env.JWT_SECRET || "Noentras08$",
    jwtExpiration: process.env.JWT_EXPIRATION || "1h",
    socketClient: "https://cream-magnificent-knuckle.glitch.me",
  },
};
