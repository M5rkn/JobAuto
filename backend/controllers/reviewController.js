const Review = require('../models/Review');
const Car = require('../models/Car');

// Получить отзывы по id машины
exports.getReviewsByCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ car: carId }).populate('user', 'username');
    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать отзыв
exports.createReview = async (req, res) => {
  try {
    const { carId } = req.params;
    const { rating, text } = req.body;
    if (!rating || !text || text.length < 10) {
      return res.status(400).json({ message: 'Оценка и комментарий (минимум 10 символов) обязательны' });
    }
    // Проверка, что машина существует
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }
    const review = new Review({
      car: carId,
      user: req.user.id,
      rating,
      text,
    });
    await review.save();
    await review.populate('user', 'username');
    res.status(201).json(review);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Редактировать отзыв
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, rating } = req.body;
    if (!text || text.length < 10) {
      return res.status(400).json({ message: 'Комментарий должен содержать минимум 10 символов' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Оценка обязательна (от 1 до 5)' });
    }
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Отзыв не найден' });
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на редактирование этого отзыва' });
    }
    review.text = text;
    review.rating = rating;
    await review.save();
    await review.populate('user', 'username');
    res.json(review);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить отзыв
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Отзыв не найден' });
    if (review.user.toString() !== req.user.id && !['admin','manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Нет прав на удаление этого отзыва' });
    }
    await review.deleteOne();
    res.json({ message: 'Отзыв удалён' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 