const pool = require("../database/");

/* ***************************************
 * Get all classification data
 * *************************************** */

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* **************************************
 * Get all inventory items and classification_name by classification_id
 * ************************************** */

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error ", error);
  }
}

/* ******************************************
 * Get Inventory item by inventory_id
 * ****************************************** */
async function getInventoryItemById(inventory_id) {
  try {
    const data = await pool.query(
      `
                SELECT *
                FROM public.inventory AS i
                JOIN public.classification AS c
                ON i.classification_id = c.classification_id
                WHERE inv_id = $1
                `,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getinventorybyid error ", error);
  }
}

/**
 * Insert Classification Item
 */
async function addClassification(classification_name) {
  try {
    const sql = `
            INSERT INTO classification (classification_name)
            VALUES ($1) RETURNING *
        `;
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/**
 * Insert Inventory Item
 */
async function addInventory(params) {
    try {
        const sql = `
            INSERT INTO inventory (
                inv_make
                ,inv_model
                ,inv_year
                ,inv_description
                ,inv_image
                ,inv_thumbnail
                ,inv_price
                ,inv_miles
                ,inv_color
                ,classification_id
            )
            VALUES (
                $1
                ,$2
                ,$3
                ,$4
                ,'/images/vehicles/no-image.png'
                ,'/images/vehicles/no-image-tn.png'
                ,$5
                ,$6
                ,$7
                ,$8
            )
            RETURNING *
        `;
        return await pool.query(sql, [
          params.inv_make,
          params.inv_model,
          params.inv_year,
          params.inv_description,
          params.inv_price,
          params.inv_miles,
          params.inv_color,
          params.classification_id,
        ]);
    } catch (error) {
        return error.message;
    }
}

/**
 * Update Inventory Item
 */
async function updateInventory(params) {
    try {
        const sql = `
            UPDATE inventory
            SET inv_make = $1
                ,inv_model = $2
                ,inv_description = $3
                ,inv_price = $4
                ,inv_miles = $5
                ,inv_color = $6
                ,inv_thumbnail = $7
                ,inv_year = $8
            WHERE inv_id = $9
            RETURNING *
        `;
        const data = await pool.query(sql, [
            params.inv_make,
            params.inv_model,
            params.inv_description,
            params.inv_price,
            params.inv_miles,
            params.inv_color,
            params.classification_id,
            params.inv_year,
            params.inv_id
        ])
        return data.rows[0];
    } catch (error) {
        console.error("model error: " + error); 
    }
}

/**
 * Update Inventory Item
 */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
};
