const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const reviewRoutes = require('./routes/reviewRoutes');

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/test-drives', require('./routes/testDriveRoutes'));
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Car Dealership API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 