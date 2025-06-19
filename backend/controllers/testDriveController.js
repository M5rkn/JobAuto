const TestDrive = require('../models/TestDrive');
const Car = require('../models/Car');


exports.createTestDriveRequest = async (req, res) => {
  const { carId, requestedDate, notes } = req.body;
  try {
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const testDrive = new TestDrive({
      user: req.user.id,
      car: carId,
      carDetails: { brand: car.brand, model: car.model },
      requestedDate,
      notes,
    });

    const createdTestDrive = await testDrive.save();
    res.status(201).json(createdTestDrive);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


exports.getMyTestDrives = async (req, res) => {
  try {
    const testDrives = await TestDrive.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getAllTestDrives = async (req, res) => {
  try {
    const testDrives = await TestDrive.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.updateTestDriveStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const testDrive = await TestDrive.findById(req.params.id);
    if (!testDrive) return res.status(404).json({ message: 'Test drive not found' });

    testDrive.status = status;
    await testDrive.save();
    res.json(testDrive);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteTestDrive = async (req, res) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id);
    if (!testDrive) return res.status(404).json({ message: 'Заявка не найдена' });
    await testDrive.deleteOne();
    res.json({ message: 'Заявка удалена' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 