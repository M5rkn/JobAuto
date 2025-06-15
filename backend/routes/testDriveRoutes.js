const express = require('express');
const router = express.Router();
const { 
    createTestDriveRequest,
    getMyTestDrives,
    getAllTestDrives,
    updateTestDriveStatus 
} = require('../controllers/testDriveController');
const { protect, isAdminOrManager } = require('../middleware/authMiddleware');

// @route    POST api/test-drives
// @desc     Create a test drive request
// @access   Private
router.post('/', protect, createTestDriveRequest);

// @route    GET api/test-drives/my-drives
// @desc     Get user's test drive requests
// @access   Private
router.get('/my-drives', protect, getMyTestDrives);

// @route    GET api/test-drives/all
// @desc     Get all test drive requests (for admins)
// @access   Private/Admin/Manager
router.get('/all', protect, isAdminOrManager, getAllTestDrives);

// @route    GET api/test-drives
// @desc     Get all test drive requests
// @access   Private/Admin/Manager
router.get('/', protect, isAdminOrManager, getAllTestDrives);

// @route    PUT api/test-drives/:id
// @desc     Update a test drive request status
// @access   Private/Admin/Manager
router.put('/:id', protect, isAdminOrManager, updateTestDriveStatus);

module.exports = router; 