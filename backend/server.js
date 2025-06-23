const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.APPLICATION_URL || 'http://localhost:5173', // Fallback for local dev
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable if using cookies/sessions
};

app.use(cors(corsOptions)); // Only call this once
app.use(express.json());

// MongoDB connection with improved options
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Fail fast if no connection
  socketTimeoutMS: 45000 // Close idle connections
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if no DB connection
});

// API routes
app.use('/api/jobs', jobRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Now shows actual port
});