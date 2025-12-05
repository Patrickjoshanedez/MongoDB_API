/**
 * Student Model
 * =============
 * Mongoose schema for Students collection
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Student_ID: {
    type: Number,
    required: [true, 'Student ID is required'],
    unique: true,
    min: [1, 'Student ID must be positive']
  },
  Last_Name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  First_Name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  Middle_Initial: {
    type: String,
    trim: true,
    maxlength: [1, 'Middle initial must be 1 character'],
    uppercase: true
  },
  City: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  Province: {
    type: String,
    trim: true,
    maxlength: [50, 'Province name cannot exceed 50 characters']
  },
  Postal_Code: {
    type: String,
    trim: true,
    maxlength: [10, 'Postal code cannot exceed 10 characters']
  },
  Phone_Number: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
studentSchema.virtual('full_name').get(function() {
  const middle = this.Middle_Initial ? ` ${this.Middle_Initial}.` : '';
  return `${this.First_Name}${middle} ${this.Last_Name}`;
});

// Virtual for full address
studentSchema.virtual('full_address').get(function() {
  const parts = [this.City, this.Province, this.Postal_Code].filter(Boolean);
  return parts.join(', ');
});

// Index for faster queries
studentSchema.index({ Last_Name: 1, First_Name: 1 });

module.exports = mongoose.model('Student', studentSchema);
