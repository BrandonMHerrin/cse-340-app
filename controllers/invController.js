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

module.exports = invCont;