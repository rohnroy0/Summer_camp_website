require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const registerRoutes = require('./routes/register');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const { apiLimiter } = require('./middleware/rateLimiter');
const setupAdmin = require('./adminSetup');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Setup AdminJS Dashboard
setupAdmin(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Rate Limiting globally for API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/register', registerRoutes);
app.use('/api/', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
