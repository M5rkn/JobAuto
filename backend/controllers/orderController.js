const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Car = require('../models/Car');


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('car', 'brand model');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email').populate('car', 'brand model');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }


    if (!order.carDetails || !order.carDetails.brand) {
      const carData = await Car.findById(order.car);
      if (carData) {
        order.set({
          carDetails: {
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
          },
          priceAtOrder: carData.price,
        });
      } else {
        order.set({
          carDetails: {
            brand: 'Deleted',
            model: 'Car',
            year: 2000,
          },
          priceAtOrder: 0,
        });
      }
    }


    const oldStatus = order.status;
    order.status = req.body.status;

    const car = await Car.findById(order.car);
    if (car) {
      if (oldStatus !== 'Confirmed' && order.status === 'Confirmed') {
        car.status = 'sold';
        await car.save();
      } else if (oldStatus === 'Confirmed' && order.status === 'Cancelled') {
        car.status = 'available';
        await car.save();
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createOrderFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.car');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const createdOrders = [];
    for (const item of cart.items) {
      const order = new Order({
        user: req.user.id,
        car: item.car._id,
        carDetails: {
          brand: item.car.brand,
          model: item.car.model,
          year: item.car.year,
        },
        priceAtOrder: item.car.price,
      });
      const createdOrder = await order.save();
      createdOrders.push(createdOrder);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ msg: 'Orders created successfully', orders: createdOrders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }



    await order.deleteOne(); 

    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
}; 