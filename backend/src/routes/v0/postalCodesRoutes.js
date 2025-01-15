const express = require("express");
const router = express.Router();
const { postalCodesController } = require("../../controllers");

router.post("/postal-codes", postalCodesController.getPostalCodes);

module.exports = router;
