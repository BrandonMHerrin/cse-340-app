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
router.get("/", Util.handleErrors(invController.buildManagement));

// Route to build create classification form
router.get(
  "/add-classification",
  Util.handleErrors(invController.buildNewClassification)
);

// Process the add-classication attempt
router.post(
  "/add-classification",
  managementValidation.classificationRules(),
  managementValidation.checkClassificationData,
  Util.handleErrors(invController.addClassification)
);

// Route to build inventory form
router.get(
  "/add-inventory",
  Util.handleErrors(invController.buildAddInventory)
);

// Process the add-inventory attempt
router.post(
  "/add-inventory",
  managementValidation.inventoryRules(),
  managementValidation.checkInventoryData,
  Util.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  Util.handleErrors(invController.getInventoryJSON)
);
router.get("/edit/:inv_id", Util.handleErrors(invController.buildEditView));
router.post(
  "/edit/",
  managementValidation.inventoryRules(),
  managementValidation.checkEditData,
  Util.handleErrors(invController.editInventory)
);

module.exports = router;
