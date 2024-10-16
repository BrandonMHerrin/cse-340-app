const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***********************************
* Build inventory by classification view
* *********************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
}

invCont.buildByInvId = async (req, res, next) => {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryItemById(inv_id);
    const invItem = data[0];
    const detail = await utilities.buildItemDetail(invItem);
    let nav = await utilities.getNav();
    const title = `${invItem.inv_year} ${invItem.inv_make} ${invItem.inv_model}`;
    res.render("./inventory/detail", {
      title,
      nav,
      detail,
    });
}

invCont.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
    })
}

invCont.buildNewClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    });
}

invCont.addClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    const title = "Add Classification";
    const successRoute = "inventory/management";
    const failureRoute = "inventory/add-classification";

    const { classification_name } = req.body;

    const addResult = await invModel.addClassification(classification_name);

    if (addResult) {
        nav = await utilities.getNav();
        req.flash(
            "notice",
            `Classificaiton, ${classification_name} added successfully.`
        );
        res.status(201).render(successRoute, {
            title,
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, failed to add the classification item.")
        res.status(501).render(failureRoute, {
          title,
          nav,
          errors: null,
        });
    }
}

invCont.buildAddInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
    })
}

invCont.addInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    
    const inventoryProps = {
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    };

    const addResult = await invModel.addInventory(inventoryProps);

    if (addResult) {
        const newInventoryItem = addResult.rows[0];
        req.flash(
            "notice",
            `${inventoryProps.inv_make} ${inventoryProps.inv_model} added.`
        );
        const title = `${newInventoryItem.inv_year} ${newInventoryItem.inv_make} ${newInventoryItem.inv_model}`;
        const data = await invModel.getInventoryItemById(newInventoryItem.inv_id)
        const detail = await utilities.buildItemDetail(data[0]);
        res.status(201).render("inventory/detail", {
          title,
          nav,
          detail,
        });
    } else {
        req.flash("notice", "Sorry, failed to add the inventory item.");
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
        });
    }
}

module.exports = invCont;