// Needed Resources
const express = require("express");
const router = new express.Router();
const acctController = require("../controllers/accountController");
const Util = require("../utilities/");
const regValidate = require('../utilities/account-validation');

router.get("/login", Util.handleErrors(acctController.buildLogin));
router.get("/register", Util.handleErrors(acctController.buildRegister));
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    Util.handleErrors(acctController.registerAccount)
);

module.exports = router;