import express from 'express';
import { placeOrder, getAllOrders, getOrderById, getOrdersByUser, updateOrder, deleteOrder } from '../controllers/ordersController.js';
import { protect } from '../controllers/authController.js';

// Create a new router instance
export const ordersRouter = express.Router();

// Route to place a new order (protected route)
ordersRouter.post('/place-order', protect, placeOrder);

// Route to get all orders (protected route)
ordersRouter.get('/', protect, getAllOrders);

// Route to get a specific order by ID (protected route)
ordersRouter.get('/:id', protect, getOrderById);

// Route to update a specific order by ID (protected route)
ordersRouter.patch('/:id', protect, updateOrder);

// Route to delete a specific order by ID (protected route)
ordersRouter.delete('/:id', protect, deleteOrder);

// Route to get all orders by a specific user ID (protected route)
ordersRouter.get('/user/:id', protect, getOrdersByUser);
