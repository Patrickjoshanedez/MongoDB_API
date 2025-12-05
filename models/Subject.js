/**
 * Subject Model
 * =============
 * Mongoose schema for Subjects collection
 */

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  Subject_Code: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Subject code cannot exceed 10 characters']
  },
  Name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [100, 'Subject name cannot exceed 100 characters']
  },
  Units: {
    type: Number,
    required: [true, 'Units are required'],
    min: [1, 'Units must be at least 1'],
    max: [6, 'Units cannot exceed 6']
  },
  FK_Course_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
subjectSchema.index({ Subject_Code: 1 });
subjectSchema.index({ FK_Course_ID: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
