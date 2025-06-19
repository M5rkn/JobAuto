const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Получить отзывы по id машины
router.get('/car/:carId', reviewController.getReviewsByCar);

// Оставить отзыв (требуется авторизация)
router.post('/car/:carId', protect, reviewController.createReview);

// Редактировать отзыв (только автор)
router.patch('/:reviewId', protect, reviewController.updateReview);

// Удалить отзыв (только автор)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router; 