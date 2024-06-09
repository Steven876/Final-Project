import { pool } from '../database/dbConnection.js';

// Place a new order
export const placeOrder = async (req, res, next) => {
    const { customerName, customerEmail, gasType, quantity, price, phone, location} = req.body;
    const userId = req.user.id; 

    let sqlQuery = `
        INSERT INTO orders (customerName, customerEmail, gasType, quantity, price, userId, phone, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        // Execute the SQL query to insert a new order
        const [result] = await pool.query(sqlQuery, [customerName, customerEmail, gasType, quantity, price, userId, phone, location]);
        const orderId = result.insertId;
        res.status(201).json({
            status: 'success',
            data: {
                order: { id: orderId, customerName, customerEmail, gasType, quantity, price, userId, phone, location }
            }
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
    let sqlQuery = 'SELECT * FROM orders';
    try {
        // Execute the SQL query to retrieve all orders
        const [orders] = await pool.query(sqlQuery);
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
    const { id } = req.params;
    let sqlQuery = 'SELECT * FROM orders WHERE id = ?';
    try {
        // Execute the SQL query to retrieve the order by ID
        const [orders] = await pool.query(sqlQuery, [id]);
        if (orders.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Order not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { order: orders[0] }
        });
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

// Update order
export const updateOrder = async (req, res, next) => {
    const { id } = req.params;
    console.log(`Received update request for order ID: ${id}`); // Log the ID
    const { customerName, customerEmail, gasType, quantity, price, userId } = req.body;

    let sqlQuery = `
        UPDATE orders
        SET customerName = ?, customerEmail = ?, gasType = ?, quantity = ?, price = ?, userId = ?
        WHERE id = ?
    `;

    try {
        // Execute the SQL query to update the order
        const [result] = await pool.query(sqlQuery, [customerName, customerEmail, gasType, quantity, price, userId, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Order not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                order: { id, customerName, customerEmail, gasType, quantity, price, userId }
            }
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

// Delete order
export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    let sqlQuery = 'DELETE FROM orders WHERE id = ?';

    try {
        // Execute the SQL query to delete the order
        const [result] = await pool.query(sqlQuery, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Order not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

// Get orders by user ID
export const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    let sqlQuery = 'SELECT * FROM orders WHERE userId = ?';

    try {
        // Execute the SQL query to retrieve orders by user ID
        const [orders] = await pool.query(sqlQuery, [userId]);
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};
