const express = require("express");
const router = express.Router();
const { dashboardController } = require("../../controllers");

router.post("/dashboard", dashboardController.upsertDashboard);
router.get("/dashboard", dashboardController.findDashboard);

module.exports = router;
