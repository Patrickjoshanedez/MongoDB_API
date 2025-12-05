/**
 * Student Routes
 * ==============
 * CRUD operations for Students collection
 */

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ Last_Name: 1, First_Name: 1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get single student by ObjectId
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/students/student-id/:studentId
 * @desc    Get single student by Student_ID
 * @access  Public
 */
router.get('/student-id/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ Student_ID: req.params.studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/students
 * @desc    Create new student
 * @access  Public
 */
router.post('/',
  [
    body('Student_ID').isInt({ min: 1 }).withMessage('Student ID must be a positive integer'),
    body('First_Name').trim().notEmpty().withMessage('First name is required'),
    body('Last_Name').trim().notEmpty().withMessage('Last name is required'),
    body('Middle_Initial').optional().trim().isLength({ max: 1 }).withMessage('Middle initial must be 1 character'),
    body('Phone_Number').optional().trim().isLength({ max: 15 }).withMessage('Phone number cannot exceed 15 characters')
  ],
  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const student = await Student.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      // Handle duplicate Student_ID
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Student ID already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student by ObjectId
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student by ObjectId
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
