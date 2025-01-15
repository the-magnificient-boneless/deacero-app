const { Router } = require("express");

const {
  login,
  register,
  apikeyController,
} = require("../../services/authService");

const router = Router();

//router.post("/login", login);
//router.post("/register", register);
router.post("/apikey", apikeyController);

module.exports = router;
