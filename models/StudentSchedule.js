/**
 * Student Schedule Model
 * ======================
 * Mongoose schema for Student_Schedule collection (COR Details)
 */

const mongoose = require('mongoose');

const studentScheduleSchema = new mongoose.Schema({
  Schedule_ID: {
    type: Number,
    required: [true, 'Schedule ID is required'],
    unique: true,
    min: [1, 'Schedule ID must be positive']
  },
  FK_Enrollment_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment reference is required']
  },
  FK_Subject_Code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required']
  },
  Room: {
    type: String,
    trim: true,
    maxlength: [20, 'Room cannot exceed 20 characters']
  },
  Class_Schedule: {
    type: String,
    trim: true,
    maxlength: [50, 'Class schedule cannot exceed 50 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate subject enrollment
studentScheduleSchema.index({ FK_Enrollment_ID: 1, FK_Subject_Code: 1 }, { unique: true });

module.exports = mongoose.model('StudentSchedule', studentScheduleSchema);
