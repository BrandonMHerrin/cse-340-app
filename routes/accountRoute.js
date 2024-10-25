// Needed Resources
const express = require("express");
const router = new express.Router();
const acctController = require("../controllers/accountController");
const Util = require("../utilities/");
const regValidate = require("../utilities/account-validation");

router.get("/login", Util.handleErrors(acctController.buildLogin));
router.get("/register", Util.handleErrors(acctController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  Util.handleErrors(acctController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(acctController.accountLogin)
);

// Route to the account view
router.get(
  "/",
  Util.checkLogin,
  Util.handleErrors(acctController.buildAccount)
);

// Route to logout user
router.get("/logout", Util.handleErrors(acctController.logoutUser));

// Route to the upate user view 
router.get("/update/:account_id", Util.handleErrors(acctController.buildUpdateView));

// Route the account update
router.post(
  "/update", 
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateData,
  Util.handleErrors(acctController.updateAccount)
);

// Route the password update
router.post(
  "/password-update",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordData,
  Util.handleErrors(acctController.updatePassword)
);

module.exports = router;
