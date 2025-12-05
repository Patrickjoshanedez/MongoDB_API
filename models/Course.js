/**
 * Course Model
 * ============
 * Mongoose schema for Courses collection
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  Course_ID: {
    type: Number,
    required: [true, 'Course ID is required'],
    unique: true,
    min: [1, 'Course ID must be positive']
  },
  Name: {
    type: String,
    required: [true, 'Course name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  Department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters']
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Course', courseSchema);
