const express = require("express");
const router = express.Router();
const { productsController } = require("../../controllers");

router.post("/", productsController.upsertProducts);
router.get("/", productsController.getAllProductsPagination);

module.exports = router;
