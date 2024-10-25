const utilities = require("../utilities/");
const model = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************
 * Deliver the login view
 * **************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************
 * Deliver the registration view
 * *************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* *******************************
 * Process Registration
 * ****************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost(salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await model.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* *****************************
 * Process login request
 * **************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await model.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notict", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    const result = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (result) {
      delete accountData.account_password;
      const access_token = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", access_token, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", access_token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ***********************************
 * Deliver the account view
 * ********************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
  });
}

/**
 * Logout the user
 */
async function logoutUser(req, res, next) {
  res.clearCookie("jwt");
  res.status(204).send();
}

/**
 * Build the account update view
 */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await model.getAccountById(req.params.account_id);
  res.render("account/update", {
    title: "Update Account",
    errors: null,
    nav,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  });
}

/**
 * Process the update
 */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();

  const update = {
    account_id: req.body.account_id,
    account_firstname: req.body.account_firstname,
    account_lastname: req.body.account_lastname,
    account_email: req.body.account_email,
  };

  const updateResult = await model.updateAccount(update);

  if (updateResult) {
    req.flash("notice", "Congratulations, your account has been updated.");
    res.status(200).render("account/account", {
      title: "Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the udpate failed.");
    const accountData = await model.getAccountById(update.account_id);
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

/**
 * Process the password update
 */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost(salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    const { account_firstname, account_lastname, account_email } =
      await model.getAccountById(account_id);
    req.flash("notice", "Sorry, there was an error updating your password.");
    res.status(500).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const passwordUpdateResult = await model.updatePassword(
    account_id,
    hashedPassword
  );

  if (passwordUpdateResult) {
    req.flash("notice", "Congratulations, your password has been updated.");
    res.status(200).render("account/account", {
      title: "Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the udpate failed.");
    const accountData = await model.getAccountById(update.account_id);
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  logoutUser,
  buildUpdateView,
  updateAccount,
  updatePassword
};
