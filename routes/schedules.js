/**
 * Student Schedule Routes
 * =======================
 * CRUD operations for Student_Schedule collection
 */

const express = require('express');
const router = express.Router();
const StudentSchedule = require('../models/StudentSchedule');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * @route   GET /api/schedules
 * @desc    Get all schedules with populated references
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const schedules = await StudentSchedule.find()
      .populate({
        path: 'FK_Enrollment_ID',
        populate: [
          { path: 'FK_Student_ID', select: 'First_Name Last_Name Student_ID' },
          { path: 'FK_Course_ID', select: 'Name Department' }
        ]
      })
      .populate('FK_Subject_Code', 'Subject_Code Name Units')
      .sort({ Schedule_ID: 1 });
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
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
 * @route   GET /api/schedules/:id
 * @desc    Get single schedule by ObjectId
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule ID format'
      });
    }

    const schedule = await StudentSchedule.findById(req.params.id)
      .populate({
        path: 'FK_Enrollment_ID',
        populate: [
          { path: 'FK_Student_ID', select: 'First_Name Last_Name Student_ID' },
          { path: 'FK_Course_ID', select: 'Name Department' }
        ]
      })
      .populate('FK_Subject_Code', 'Subject_Code Name Units');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: schedule
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
 * @route   GET /api/schedules/enrollment/:enrollmentId
 * @desc    Get all schedules for a specific enrollment
 * @access  Public
 */
router.get('/enrollment/:enrollmentId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.enrollmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID format'
      });
    }

    const schedules = await StudentSchedule.find({ FK_Enrollment_ID: req.params.enrollmentId })
      .populate('FK_Subject_Code', 'Subject_Code Name Units')
      .sort({ Class_Schedule: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
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
 * @route   POST /api/schedules
 * @desc    Create new schedule
 * @access  Public
 */
router.post('/',
  [
    body('Schedule_ID').isInt({ min: 1 }).withMessage('Schedule ID must be a positive integer'),
    body('FK_Enrollment_ID').custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid enrollment ID format');
      }
      return true;
    }),
    body('FK_Subject_Code').custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid subject ID format');
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
      const schedule = await StudentSchedule.create(req.body);
      const populatedSchedule = await StudentSchedule.findById(schedule._id)
        .populate({
          path: 'FK_Enrollment_ID',
          populate: [
            { path: 'FK_Student_ID', select: 'First_Name Last_Name Student_ID' },
            { path: 'FK_Course_ID', select: 'Name Department' }
          ]
        })
        .populate('FK_Subject_Code', 'Subject_Code Name Units');

      res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: populatedSchedule
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Schedule ID already exists or duplicate enrollment-subject combination'
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
 * @route   PUT /api/schedules/:id
 * @desc    Update schedule by ObjectId
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule ID format'
      });
    }

    const schedule = await StudentSchedule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'FK_Enrollment_ID',
        populate: [
          { path: 'FK_Student_ID', select: 'First_Name Last_Name Student_ID' },
          { path: 'FK_Course_ID', select: 'Name Department' }
        ]
      })
      .populate('FK_Subject_Code', 'Subject_Code Name Units');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
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
 * @route   DELETE /api/schedules/:id
 * @desc    Delete schedule by ObjectId
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule ID format'
      });
    }

    const schedule = await StudentSchedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully',
      data: schedule
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
