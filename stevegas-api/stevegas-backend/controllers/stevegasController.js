import { pool } from '../database/dbConnection.js';
import { getRandomHexValues } from '../utils/utils.js';

// Retrieve all available gas
export const getAllGas = async (req, res, next) => {
    let sqlQuery = 'SELECT * FROM gastype';
    // Execute the SQL query to retrieve all gas types
    const [gas] = await pool.query(sqlQuery);
    res.status(200).json({
        status: 'success',
        results: gas.length,
        data: { gas: gas }
    });
};

// Create a new gas entry
export const createGas = async (req, res, next) => {
    const { type, price } = req.body;
    let imgPath = null;

    if (req.file) {
        imgPath = req.file.filename; // Store only the filename
    }

    const sqlQuery = ` 
        INSERT INTO gastype (type, price, img)
        VALUES (?, ?, ?)
    `;
    try {
        // Execute the SQL query to insert a new gas type
        const [gas] = await pool.query(sqlQuery, [type, price, imgPath]);
        res.status(201).json({
            status: 'success',
            insertId: gas.insertId
        });
    } catch (error) {
        console.error('Error in createGas:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a gas entry
export const deleteGas = async (req, res, next) => {
    let sqlQuery = `DELETE FROM gastype WHERE id = ${req.params.id}`;
    // Execute the SQL query to delete a gas type by ID
    const [gas] = await pool.query(sqlQuery);
    if (gas.affectedRows == 0) {
        res.status(404).json({
            status: 'Error',
            message: 'Unable to Delete Record'
        });
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Successfully Removed Record'
        });
    }
};

// Retrieve a single gas entry by ID
export const singleGas = async (req, res, next) => {
    let sqlQuery = `SELECT * FROM gastype WHERE id = ${req.params.id}`;
    // Execute the SQL query to retrieve a gas type by ID
    const [gas] = await pool.query(sqlQuery);
    if (gas.length <= 0) {
        res.status(404).json({
            status: 'Error',
            message: 'Record Not Found'
        });
    } else {
        res.status(200).json({
            status: 'success',
            results: gas.length,
            data: { gas: gas }
        });
    }
};

// Update a gas entry by ID
export const updateGas = async (req, res, next) => {
    const { id } = req.params;
    const { type, price } = req.body;
    let img = req.body.img;

    if (req.file) {
        img = req.file.filename;
    }

    console.log('Updating gas with ID:', id, 'Data:', { type, price, img });

    let sqlQuery = `
        UPDATE gastype 
        SET type = ?, price = ?, img = ?
        WHERE id = ?
    `;

    try {
        // Execute the SQL query to update a gas type by ID
        const [result] = await pool.query(sqlQuery, [type, price, img, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Gas record not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Gas record updated successfully',
            data: [result]
        });
    } catch (error) {
        console.error('Update failed:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};
