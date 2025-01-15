const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");

router.post("/", userController.createUser);
router.post("/image", userController.uploadImage);

module.exports = router;
