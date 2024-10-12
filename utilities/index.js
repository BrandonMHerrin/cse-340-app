const invModel = require("../models/inventory-model");
const Util = {};

/* **************************************************
* Constructs the nav HTML unordered list
* ************************************************** */

Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>";
        list += 
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
}

/* ************************************************
* Build the classification view HTML
* ************************************************ */

Util.buildClassificationGrid = async function(data) {
    let grid;
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>';
            grid += '<div class="namePrice">';
            grid += '<hr />';
            grid += '<h2>';
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
            grid += '</div>';
            grid += '</li>';
        });
        grid += '</ul>';
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}

/* *************************************
* Build Item Detail HTML
* ************************************* */

Util.buildItemDetail = async function(details) {
    let content = '';
    if(details) {
        content += `
            <div class="detail-wrapper">
                <div>
                    <img src="${details.inv_image}" alt="${details.inv_year} ${
            details.inv_make
            } ${details.inv_model}">
            </div>
            <div>
                <h2>$${new Intl.NumberFormat("en-US").format(
                details.inv_price
                )}</h2>
                <p>${details.inv_description}</p>
                    <br>
                    <p><label>Classification:</label> ${details.classification_name}</p>
                    <p><label>Year:</label> ${details.inv_year}</p>
                    <p><label>Make:</label> ${details.inv_make}</p>
                    <p><label>Model:</label> ${details.inv_model}</p>
                    <p><label>Color:</label> ${details.inv_color}</p>
                    <p><label>Miles:</label> ${new Intl.NumberFormat('en-US').format(details.inv_miles)}</p>
                </div>
            </div>
        `;
    } else {
        content += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return content;
} 

/* *****************************
* Middleware For Handling Errors
* Wrap other function in this for
* General error handling
* ***************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;