const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUsers,
  updateUserRole,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route    POST api/users/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('name', 'Пожалуйста, введите ваше имя').not().isEmpty(),
    check('username', 'Пожалуйста, введите имя пользователя (логин)').not().isEmpty(),
    check('email', 'Пожалуйста, введите корректный email').isEmail(),
    check('password', 'Пароль должен содержать не менее 6 символов').isLength({ min: 6 }),
  ],
  registerUser
);

// @route    POST api/users/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Пожалуйста, введите корректный email').isEmail(),
    check('password', 'Пожалуйста, введите пароль').exists(),
  ],
  loginUser
);

// @route    GET api/users
// @desc     Get all users
// @access   Private/Admin
router.get('/', protect, isAdmin, getUsers);

// @route    PUT api/users/:id/role
// @desc     Update user role
// @access   Private/Admin
router.put('/:id/role', protect, isAdmin, updateUserRole);

// @route    PUT api/users/profile
// @desc     Update user profile
// @access   Private
router.put('/profile', protect, updateUserProfile);

module.exports = router; 