const Car = require('../models/Car');



const getCars = async (req, res) => {
  try {
    const { brand, status, minPrice, maxPrice, searchTerm } = req.query;

    let filter = {};
    const andConditions = [];

    if (brand) andConditions.push({ brand: brand });
    if (status) andConditions.push({ status: status });

    if (minPrice || maxPrice) {
      const priceCondition = {};
      if (minPrice) priceCondition.$gte = Number(minPrice);
      if (maxPrice) priceCondition.$lte = Number(maxPrice);
      andConditions.push({ price: priceCondition });
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      andConditions.push({
        $or: [
          { brand: searchRegex },
          { model: searchRegex }
        ]
      });
    }

    if (andConditions.length > 0) {
      filter = { $and: andConditions };
    }

    const cars = await Car.find(filter);
    res.json(cars);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Car not found' });
    }
    res.status(500).send('Server Error');
  }
};


const createCar = async (req, res) => {
    const { brand, model, year, price, vin, imageUrl } = req.body;

    try {
        const car = new Car({
            brand,
            model,
            year,
            price,
            vin,
            imageUrl,
        });

        const createdCar = await car.save();
        res.status(201).json(createdCar);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


const updateCar = async (req, res) => {
    const { brand, model, year, price, vin, imageUrl, status } = req.body;

    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        car.brand = brand || car.brand;
        car.model = model || car.model;
        car.year = year || car.year;
        car.price = price || car.price;
        car.vin = vin || car.vin;
        car.imageUrl = imageUrl || car.imageUrl;
        car.status = status || car.status;

        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await car.deleteOne();
        res.json({ message: 'Car removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
}; 