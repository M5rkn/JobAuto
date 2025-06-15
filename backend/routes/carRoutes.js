const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect, isAdminOrManager } = require('../middleware/authMiddleware');

// @route    POST api/cars
// @desc     Create a car
// @access   Private (Admin/Manager)
router.post('/', protect, isAdminOrManager, createCar);

// @route    GET api/cars
// @desc     Get all cars
// @access   Public
router.get('/', getCars);

// @route    GET api/cars/:id
// @desc     Get a single car
// @access   Public
router.get('/:id', getCarById);

// @route    PUT api/cars/:id
// @desc     Update a car
// @access   Private (Admin/Manager)
router.put('/:id', protect, isAdminOrManager, updateCar);

// @route    DELETE api/cars/:id
// @desc     Delete a car
// @access   Private (Admin/Manager)
router.delete('/:id', protect, isAdminOrManager, deleteCar);

module.exports = router; 