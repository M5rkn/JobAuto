const Cart = require('../models/Cart');
const Car = require('../models/Car');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.car');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  const { carId } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.car.toString() === carId);

    if (itemIndex > -1) {
      // For now, we assume quantity is always 1 and don't increment.
      return res.status(400).json({ msg: 'Item already in cart' });
    } else {
      cart.items.push({ car: carId, quantity: 1 });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.car');
    res.json(populatedCart);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:carId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { carId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.car.toString() !== carId);
    
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.car');
    res.json(populatedCart);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 