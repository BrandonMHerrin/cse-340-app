const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/**
 * Classification Data Validation Rules
 */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("Please provide a classification name."),
  ];
};

/**
 * Check classification data and return error
 */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors,
      nav,
    });
    return;
  }
  next();
};

/**
 * Inventory Data Validation Rules
 */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the model of the vehicle."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: 2050 })
      .withMessage("Please provide the year of the vehicle"),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description of the vehicle."),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image of the vehicle."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail for the vehicle."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide the price of the vehicle."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide the miles of the vehicle."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the color of the vehicle."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please provide the classification of the vehicle."),
  ];
};

/**
 * Validate inventory data and return error
 */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      errors,
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/**
 * Validate inventory data and returd edit view
 */
validate.checkEditData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      errors,
      nav,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

validate.inquiryRules = () => {
  return [
    body("inquiry_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide your first name."),

    body("inquiry_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide your last name."),

    body("inquiry_phone")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^(\(?[0-9]{3}\)?)?[0-9]{3}-[0-9]{4}$/)
      .withMessage(
        "Please provide a phone number that matches this format: (xxx)xxx-xxxx"
      ),

    body("inquiry_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email."),

    body("inquiry_message")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a message for our team."),
  ];
};

validate.checkInquiryData = async (req, res, next) => {
  const {
    inv_id,
    inquiry_firstname,
    inquiry_lastname,
    inquiry_phone,
    inquiry_email,
    inquiry_message,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const itemDetails = await invModel.getInventoryItemById(inv_id);

    res.render("inventory/send-inquiry", {
      title: "Send Inquiry",
      nav,
      errors,
      inquiry_firstname,
      inquiry_lastname,
      inquiry_phone,
      inquiry_email,
      inquiry_message,
      itemDetails
    });
    return
  }
  next();
};

module.exports = validate;
