const { Router } = require("express");

const { testController } = require("../../controllers");

const router = Router();

router.get("/error", testController.throwErrorManually);

module.exports = router;
