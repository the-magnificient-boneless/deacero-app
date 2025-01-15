const express = require("express");
const router = express.Router();
const { storesController } = require("../../controllers");

router.post("/", storesController.upsertStores);
router.get("/", storesController.getAllStoresPagination);

module.exports = router;
