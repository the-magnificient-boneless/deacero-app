const jwt = require("jsonwebtoken");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("../config/app");

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.app.jwtSecret,
  },
  (payload, done) => {
    if (payload.apiKey === config.app.apiKey) {
      return done(null, payload);
    }
    return done(null, false);
  }
);

const login = (req, res) => {
  const { username, password } = req.body;
  // Implement your login logic
  const token = jwt.sign({ username }, config.app.jwtSecret);
  res.json({ token });
};

const apikeyController = (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    res.json({ message: "'apiKey' is missing" });
  }
  if (apiKey === config.app.apiKey) {
    const token = jwt.sign({ apiKey }, config.app.jwtSecret);
    res.json({ token });
  }
};

const register = (req, res) => {
  const { username, password } = req.body;
  // Implement your registration logic
  res.json({ message: "User registered successfully" });
};

module.exports = { jwtStrategy, login, register, apikeyController };
