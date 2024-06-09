import {pool} from '../database/dbConnection.js';
import bcrypt from 'bcryptjs';
import { status } from 'init';
import JWT from 'jsonwebtoken';

const conn = pool;
/*
@description - Function to create the JWT Token based on some inputs
*/

function signJWTToken(user){
    return JWT.sign({
        id: user.id, 
        role: user.role},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
}

export const registerUser = async (req, res, next) => {
    const { email, password, fname, lname } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        const [result] = await conn.query('INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)', [email, hashedPassword, fname, lname]);
        if (result.affectedRows === 1) {
            // User successfully registered
            res.status(201).json({ status: 'success', message: 'User registered successfully' });
        } else {
            // Failed to register user
            res.status(500).json({ status: 'error', message: 'Failed to register user' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const loginUser = async (req, res, next) =>{
    const data = req.body;

    // Query the database to find the user by email
    const [user] = await conn.query(`SELECT * FROM users WHERE email = ?`, [data.email]);
    if (!user.length)
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
    });

    // Check if the user is active
    if(user[0].status == 'NACTV')
        return res.status(400).json({
                status: 'error',
                message: 'User not active on the system'
    });

    // Compare the provided password with the stored hashed password
    if(!(await bcrypt.compare(data.password, user[0].password)))
        return res.status(400).json({
            status: 'error',
            message: 'Invalid user credentials'
    });

    // Update the last login timestamp for the user
    await conn.query (`UPDATE users SET last_login = CURRENT_TIMESTAMP() WHERE ID = ?`, [user[0].id]);

    // Generate a JWT token for the user
    const token = signJWTToken(user[0]);

    // Remove the password from the user object before sending the response
    user[0].password = undefined;

    res.status(200).json({
    status: 'success',
    data: {
        token,
        user: user[0]
    }
    });

};

export const protect = async(req, res, next) => {
    const authorization = req.get('Authorization');
    console.log(`REQUEST AUTHORIZATION >> ${authorization}`);
    if(!authorization?.startsWith('Bearer'))
        return next(
            res.status(400).json({
                status: 'error',
                message: 'You must be logged in, in order to access that feature'
            })
        );

    const token = authorization.split(' ')[1];
    try{
        // Verify the JWT token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED TOKEN: ${JSON.stringify(decoded)}`);

        // Query the database to find the user by ID and check if the user is active
        const [user] = await conn.query (`SELECT * FROM users WHERE id = ? AND status = 'ACTV' `, [decoded.id]);
        if(!user.length)
            return next(
                res.status(404).json({
                    status: 'error',
                    message: 'This token is no longer valid or there is a validation error'
                })
        );

        // Remove the password from the user object before adding it to the request
        const data = user[0];
        data.password = undefined;
        req.user = data;
        next();

    }catch(error){
        console.log(error.message);
        if(error.message == 'jwt expired')
            return next(
                res.status(400).json({
                    status: 'error',
                    message: 'Token expired'
                })
        ); else if (error.message == 'jwt malformed'){
            return next (
                res.status(400).json({
                    status: 'error',
                    message: 'Token malformed'
                })
            );
        } else if(error.message == 'invalid token'){
                return next (
                    res.status(400).json({
                        status: 'error',
                        message: 'Token is invalid'
                    })
                );

        } else {
            return next (
                res.status(400).json({
                    status: 'error',
                    message: 'Unknown error'
                })
            );
        }
    }
}

export const getAllUsers = async(req, res, next) => {
    const data = req.body;

    // Query the database to get all users
    const [users] = await conn.query(`SELECT * From users`);

    res.status(200).json({
        status: 'success',
        data:{
            users: users,
        }
    });
        
}

export const getThisUser = async( req, res, next) => {
    const data = req.user;
    if(!data)
        return next();

    // Query the database to get the user by ID
    const [user] = await conn.query(`SELECT * FROM users WHERE id = ?`, [data.id]);
    if (!user.length)
        return res.status(404).json({
            status: 'error',
            message: 'Invalid Request'
    });

    // Remove the password from the user object before sending the response
    user[0].password = undefined;
    res.status(200).json({
        status: 'success',
        data: {
            user: user[0]
        }
    })

}

export const getOrdersByUser = async (req, res) => {
    const { id } = req.user; // Change to extract user ID from the authenticated user
    console.log(`Fetching orders for user ID: ${id}`);

    let sqlQuery = 'SELECT * FROM orders WHERE userId = ?';

    try {
        // Query the database to get orders by user ID
        const [orders] = await pool.query(sqlQuery, [id]);
        console.log(`Orders fetched: ${JSON.stringify(orders)}`); // Log fetched orders

        if (orders.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No orders found for this user'
            });
        }

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

// Function to get user by ID
export const getUserById = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Query the database to get the user by ID
      const [user] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
      if (!user.length) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      // Remove the password from the user object before sending the response
      user[0].password = undefined; 
      res.status(200).json({ status: 'success', data: { user: user[0] } });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
  
// Function to update user by ID
export const updateUserById = async (req, res, next) => {
    const { id } = req.params;
    const { email, fname, lname, role } = req.body;
  
    try {
      // Query the database to update the user by ID
      const [result] = await conn.query('UPDATE users SET email = ?, fname = ?, lname = ?, role = ? WHERE id = ?', [email, fname, lname, role, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found or no changes made' });
      }
      res.status(200).json({ status: 'success', message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

async function deleteOrdersByUserId(userId) {
    try {
        // Query the database to delete orders by user ID
        await conn.query('DELETE FROM orders WHERE userId = ?', [userId]);
        console.log(`Deleted orders associated with user ID: ${userId}`);
    } catch (error) {
        console.error('Error deleting associated orders:', error);
        throw error;
    }
}

// Function to delete user by ID
export const deleteUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Step 1: Delete associated orders
        await deleteOrdersByUserId(id);

        // Step 2: Delete user
        const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
