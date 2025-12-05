/**
 * Enrollment Routes
 * =================
 * CRUD operations for Enrollments collection
 */

const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * @route   GET /api/enrollments
 * @desc    Get all enrollments with populated references
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('FK_Student_ID', 'First_Name Last_Name Student_ID')
      .populate('FK_Course_ID', 'Name Department')
      .sort({ Date_Enrolled: -1 });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
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
 * @route   GET /api/enrollments/:id
 * @desc    Get single enrollment by ObjectId
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID format'
      });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('FK_Student_ID', 'First_Name Last_Name Student_ID Phone_Number')
      .populate('FK_Course_ID', 'Name Department');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
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
 * @route   POST /api/enrollments
 * @desc    Create new enrollment
 * @access  Public
 */
router.post('/',
  [
    body('Enrollment_ID').isInt({ min: 1 }).withMessage('Enrollment ID must be a positive integer'),
    body('Year_Level').isInt({ min: 1, max: 5 }).withMessage('Year level must be between 1 and 5'),
    body('FK_Course_ID').custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid course ID format');
      }
      return true;
    }),
    body('FK_Student_ID').custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid student ID format');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const enrollment = await Enrollment.create(req.body);
      const populatedEnrollment = await Enrollment.findById(enrollment._id)
        .populate('FK_Student_ID', 'First_Name Last_Name Student_ID')
        .populate('FK_Course_ID', 'Name Department');

      res.status(201).json({
        success: true,
        message: 'Enrollment created successfully',
        data: populatedEnrollment
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Enrollment ID already exists'
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
 * @route   PUT /api/enrollments/:id
 * @desc    Update enrollment by ObjectId
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID format'
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('FK_Student_ID', 'First_Name Last_Name Student_ID')
      .populate('FK_Course_ID', 'Name Department');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
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
 * @route   DELETE /api/enrollments/:id
 * @desc    Delete enrollment by ObjectId
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID format'
      });
    }

    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
      data: enrollment
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
