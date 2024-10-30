const pool = require("../database/");

/**
 * Add Inquiry
 */
async function insertInquiry(inquiry) {
    try {
        const sql = `
              INSERT INTO inquiry(inv_id, inquiry_firstname, inquiry_lastname, inquiry_phone, inquiry_email, inquiry_message)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
          `;
        const result = await pool.query(sql, [
          inquiry.inv_id,
          inquiry.inquiry_firstname,
          inquiry.inquiry_lastname,
          inquiry.inquiry_phone,
          inquiry.inquiry_email,
          inquiry.inquiry_message
        ]);

        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

/**
 * Pull all inquiries
 */
async function getInquiries() {
    try {
        const sql = `
            SELECT *
            FROM inquiry
        `
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        return error.message;
    }
}

/**
 * Delete inquiry
 */
async function deleteInquiry(inquiry_id) {
    try {
        const sql = `
            DELETE FROM inquiry
            WHERE inquiry_id = $1
        `
        return await pool.query(sql, [inquiry_id]);
    } catch (error) {
        return error.message;
    }
}

module.exports = {insertInquiry, getInquiries, deleteInquiry}