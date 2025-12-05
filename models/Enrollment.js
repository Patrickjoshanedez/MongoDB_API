/**
 * Enrollment Model
 * ================
 * Mongoose schema for Enrollments collection
 */

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  Enrollment_ID: {
    type: Number,
    required: [true, 'Enrollment ID is required'],
    unique: true,
    min: [1, 'Enrollment ID must be positive']
  },
  Date_Enrolled: {
    type: Date,
    required: [true, 'Enrollment date is required'],
    default: Date.now
  },
  Year_Level: {
    type: Number,
    required: [true, 'Year level is required'],
    min: [1, 'Year level must be between 1 and 5'],
    max: [5, 'Year level must be between 1 and 5']
  },
  FK_Course_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  FK_Student_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
enrollmentSchema.index({ Enrollment_ID: 1 });
enrollmentSchema.index({ FK_Student_ID: 1 });
enrollmentSchema.index({ FK_Course_ID: 1 });
enrollmentSchema.index({ Date_Enrolled: -1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
