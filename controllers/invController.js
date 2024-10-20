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
    const invItem = await invModel.getInventoryItemById(inv_id);
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
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Inventory Management",
        classificationSelect,
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
        const data = await invModel.getInventoryItemById(newInventoryItem.inv_id);
        const detail = await utilities.buildItemDetail(data);
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

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if (invData[0].inv_id) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
}

invCont.buildEditView = async (req, res, next) => {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getInventoryItemById(inv_id)
  let classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
  });
};

invCont.editInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const inventoryProps = {
    inv_id: req.body.inv_id,
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

  const editResult = await invModel.updateInventory(inventoryProps);

  if (editResult) {
    const itemName = `${editResult.inv_make} ${editResult.inv_model}`;
    req.flash("notice", `The ${itemName} was edited successfully.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    })
  }
};

module.exports = invCont;