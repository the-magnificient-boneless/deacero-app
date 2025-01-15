const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.auth = (req, res) => {
  const { apiKey } = req.body;

  if (apiKey === req.context.config.apiKey) {
    const token = jwt.sign({ apiKey }, req.context.config.jwtSecret, {
      expiresIn: req.context.config.jwtExpiration,
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// In authController.js
let loggedUsers = []; // Store logged-in users here

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await req.context.db.models.user.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create the JWT token
    const token = jwt.sign({ user }, req.context.config.jwtSecret, {
      expiresIn: 3600,
    });

    const userInfo = {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      date: new Date().toISOString(),
    };

    // Add user to the list if not already there
    if (!loggedUsers.some((u) => u.email === user.email)) {
      loggedUsers.push(userInfo);
    }

    // Emit the updated user list to all clients
    req.io.emit("loggedUserList", loggedUsers);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
/* 
// Emit updated list on disconnection
req.io.on("disconnect", () => {
  loggedUsers = loggedUsers.filter((u) => u.email !== user.email);
  req.io.emit("loggedUserList", loggedUsers);
}); */

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      password,
      state,
      country,
      position,
      description,
      role,
    } = req.body;
    const User = req.context.db.models.user;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      password: hashedPassword,
      state,
      country,
      position,
      description,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
