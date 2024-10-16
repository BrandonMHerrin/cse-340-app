const utilities = require(".");
const {body, validationResult } = require("express-validator");
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
            .withMessage("Please provide a classification name.")
    ]
}

/**
 * Check classification data and return error
 */
validate.checkClassificationData = async (req, res, next) => {
    const {
        classification_name
    } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add Classification",
            errors,
            nav,
        })
        return;
    }
    next();
}

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
        .isLength({min: 1})
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
}

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
        classification_id 
    } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(classification_id);
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
            inv_color
        });
        return;
    }
    next();
};

module.exports = validate;