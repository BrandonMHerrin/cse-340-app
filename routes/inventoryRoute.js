// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const Util = require("../utilities");
const managementValidation = require("../utilities/management-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
);

// Route to build detail by id view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId));

// Route to build management view
router.get("/", Util.checkElevated, Util.handleErrors(invController.buildManagement));

// Route to build create classification form
router.get(
  "/add-classification",
  Util.checkElevated,
  Util.handleErrors(invController.buildNewClassification)
);

// Process the add-classication attempt
router.post(
  "/add-classification",
  Util.checkElevated,
  managementValidation.classificationRules(),
  managementValidation.checkClassificationData,
  Util.handleErrors(invController.addClassification)
);

// Route to build inventory form
router.get(
  "/add-inventory",
  Util.checkElevated,
  Util.handleErrors(invController.buildAddInventory)
);

// Process the add-inventory attempt
router.post(
  "/add-inventory",
  Util.checkElevated,
  managementValidation.inventoryRules(),
  managementValidation.checkInventoryData,
  Util.handleErrors(invController.addInventory)
);

// Route to get inventory JSON by classification Id
router.get(
  "/getInventory/:classification_id",
  Util.handleErrors(invController.getInventoryJSON)
);

// Route to build Inventory Edit View
router.get("/edit/:inv_id", Util.checkElevated, Util.handleErrors(invController.buildEditView));

// Route to process Inventory Edit form submission
router.post(
  "/edit/",
  Util.checkElevated,
  managementValidation.inventoryRules(),
  managementValidation.checkEditData,
  Util.handleErrors(invController.editInventory)
);

// Route to build inventory delete view
router.get("/delete/:inv_id", Util.checkElevated, Util.handleErrors(invController.buildDeleteView));

// Route to delete an inventory item
router.post("/delete/", Util.checkElevated, Util.handleErrors(invController.deleteInventory));

module.exports = router;
