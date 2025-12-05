/**
 * Student Enrollment System API Server
 * =====================================
 * Express.js server with MongoDB Atlas integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialize Express app
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const subjectRoutes = require('./routes/subjects');
const enrollmentRoutes = require('./routes/enrollments');
const scheduleRoutes = require('./routes/schedules');

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/schedules', scheduleRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Enrollment System API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      courses: '/api/courses',
      subjects: '/api/subjects',
      enrollments: '/api/enrollments',
      schedules: '/api/schedules'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/\n`);
});

module.exports = app;
