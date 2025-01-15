const express = require("express");
const router = express.Router();
const { prospectController } = require("../../controllers");

router.post("/prospects", prospectController.createProspect);
router.get("/prospects", prospectController.getAllProspects);
router.put("/:id", prospectController.updateProspect);

module.exports = router;
