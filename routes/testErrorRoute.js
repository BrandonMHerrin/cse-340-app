// Needed Resources
const express = require("express");
const Util = require("../utilities");
const router = express.Router();
const controller = require("../controllers/testErrorController");

// Route to run controller error
router.get("/test-error", Util.handleErrors(controller.throwTestError));

module.exports = router;