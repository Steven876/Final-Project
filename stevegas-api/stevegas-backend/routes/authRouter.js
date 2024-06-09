import express from 'express';
import { 
    getAllUsers, getThisUser, loginUser, protect, 
    registerUser, getOrdersByUser, getUserById, 
    updateUserById, deleteUserById
} from '../controllers/authController.js';

// Create a new router instance
export const authRouter = express.Router();

// Route to register a new user
authRouter.post('/register', registerUser);

// Route to log in an existing user
authRouter.post('/login', loginUser);

// Apply the protect middleware to all routes below this line
authRouter.use(protect);

// Route to get all users (protected route)
authRouter.get('/all-users', getAllUsers);

// Route to get the current user's profile (protected route)
authRouter.get('/my-profile', getThisUser);

// Route to get orders by user ID (protected route)
authRouter.get('/user/:id', getOrdersByUser);

// Route to get a user by ID (protected route)
authRouter.get('/:id', getUserById);

// Route to update a user by ID (protected route)
authRouter.put('/update-user/:id', updateUserById);

// Route to delete a user by ID (protected route)
authRouter.delete('/delete-user/:id', deleteUserById);
