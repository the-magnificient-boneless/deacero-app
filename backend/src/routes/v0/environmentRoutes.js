const { Router } = require("express");

const { getEnvironment } = require("../../services/environmentService");

const router = Router();

router.get("/", getEnvironment);

module.exports = router;
