const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// @route    GET api/cart
// @desc     Get user's cart
// @access   Private
router.get('/', authMiddleware.protect, cartController.getCart);

// @route    POST api/cart/add
// @desc     Add item to cart
// @access   Private
router.post('/add', authMiddleware.protect, cartController.addToCart);

// @route    DELETE api/cart/remove/:carId
// @desc     Remove item from cart
// @access   Private
router.delete('/remove/:carId', authMiddleware.protect, cartController.removeFromCart);

module.exports = router; 