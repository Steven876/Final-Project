import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { gasRouter } from './routes/stevegasRouter.js';
import { authRouter } from './routes/authRouter.js';
import { ordersRouter } from './routes/ordersRouter.js';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the express app
const app = express();

// Configure multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize multer with storage settings and file size limits
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // increase the limit to 5MB for file size
    fieldSize: 10 * 1024 * 1024 // increase the limit to 10MB for field size
  }
});

// Enable CORS for specified origin
app.options('*', cors(['http://localhost:4200']));
app.use(cors(['http://localhost:4200']));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan for logging in non-production environments
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route specification
app.use('/api/v1/gas', gasRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', ordersRouter);

// Start the server and listen on the specified port
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}...`));
