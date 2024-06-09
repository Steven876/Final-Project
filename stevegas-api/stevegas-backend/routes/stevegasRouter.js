import express from 'express';
import { getAllGas, createGas, deleteGas, updateGas, singleGas } from '../controllers/stevegasController.js';
import { isAuth } from '../utils/auth.js';
import { protect } from '../controllers/authController.js';
import multer from 'multer';

// Configure multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize multer with storage settings and file size limit
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  } 
});

// Create a new router instance
export const gasRouter = express.Router();

// Route to retrieve all gas types
gasRouter.get('/all-gas', getAllGas);

// Route to retrieve a single gas entry by ID
gasRouter.get('/single-gas/:id', singleGas);

// Route to update a gas entry by ID, with file upload
gasRouter.patch('/update-gas/:id', upload.single('img'), updateGas);

// Route to create a new gas entry, with file upload
gasRouter.post('/create-gas', upload.single('img'), createGas);

// Apply the protect middleware to all routes below this line
gasRouter.use(protect);

// Route to delete a gas entry by ID (protected route)
gasRouter.delete('/delete-gas/:id', deleteGas);
