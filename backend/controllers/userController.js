const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    user = new User({
      name,
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован. Проверьте почту для подтверждения.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};


const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не зарегистрирован.' });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ message: `Аккаунт заблокирован. Попробуйте снова через ${remainingTime} минут.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }
      await user.save();
      
      if (user.lockUntil) {
          return res.status(403).json({ message: 'Аккаунт заблокирован на 15 минут из-за множества неудачных попыток.' });
      } else {
          return res.status(400).json({ message: 'Неверный email или пароль.' });
      }
    }

    // Successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    

    if (!user.name) {
      user.name = user.username;
    }

    await user.save();
    
    const payload = { user: { id: user.id, role: user.role, name: user.name, email: user.email } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      // Если нужно будет обновлять и другие поля, их можно добавить здесь
      
      const updatedUser = await user.save();


      const payload = { user: { id: updatedUser.id, role: updatedUser.role, name: updatedUser.name, email: updatedUser.email } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            message: 'Профиль успешно обновлен'
          });
        }
      );
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Ошибка сервера');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  updateUserRole,
  updateUserProfile,
};