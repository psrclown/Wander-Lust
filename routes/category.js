const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const categoryController = require("../controller/category");

router.get("/:cat", wrapAsync(categoryController.category));

module.exports = router;
