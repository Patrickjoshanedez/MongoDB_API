/**
 * Subject Routes
 * ==============
 * CRUD operations for Subjects collection
 */

const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects with course details
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('FK_Course_ID', 'Name Department')
      .sort({ Subject_Code: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
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
 * @route   GET /api/subjects/:id
 * @desc    Get single subject by ObjectId
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findById(req.params.id)
      .populate('FK_Course_ID', 'Name Department');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
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
 * @route   POST /api/subjects
 * @desc    Create new subject
 * @access  Public
 */
router.post('/',
  [
    body('Subject_Code').trim().notEmpty().withMessage('Subject code is required'),
    body('Name').trim().notEmpty().withMessage('Subject name is required'),
    body('Units').isInt({ min: 1, max: 6 }).withMessage('Units must be between 1 and 6'),
    body('FK_Course_ID').custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid course ID format');
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
      const subject = await Subject.create(req.body);
      const populatedSubject = await Subject.findById(subject._id)
        .populate('FK_Course_ID', 'Name Department');

      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: populatedSubject
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Subject code already exists'
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
 * @route   PUT /api/subjects/:id
 * @desc    Update subject by ObjectId
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('FK_Course_ID', 'Name Department');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
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
 * @route   DELETE /api/subjects/:id
 * @desc    Delete subject by ObjectId
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: subject
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
