const express = require("express");
const router = express.Router();
const { entityController } = require("../../controllers");

router.post("/store", entityController.upsertEntity);
router.post("/", entityController.getAllEntities);

module.exports = router;
