const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// @route    GET /api/orders/myorders
// @desc     Get logged in user orders
// @access   Private
router.get('/myorders', authMiddleware.protect, orderController.getMyOrders);

// @route    GET api/orders
// @desc     Get all orders
// @access   Private/Admin/Manager
router.get('/', authMiddleware.protect, authMiddleware.isAdminOrManager, orderController.getOrders);

// @route    PUT api/orders/:id
// @desc     Update order status
// @access   Private/Admin/Manager
router.put('/:id', authMiddleware.protect, authMiddleware.isAdminOrManager, orderController.updateOrderStatus);

// @route    DELETE api/orders/:id
// @desc     Delete an order
// @access   Private/Admin/Manager
router.delete('/:id', authMiddleware.protect, authMiddleware.isAdminOrManager, orderController.deleteOrder);

// @route    POST /api/orders
// @desc     Create order from cart
// @access   Private
router.post('/', authMiddleware.protect, orderController.createOrderFromCart);

module.exports = router; 