const Car = require('../models/Car');

// Add a car
exports.addCar = async (req, res) => {
    const { title, description, images, tags } = req.body;
    try {
        const car = new Car({ title, description, images, tags, owner: req.userId });
        await car.save();
        res.status(201).json(car);
    } catch (err) {
        res.status(400).json({ error: 'Error adding car' });
    }
};

// Get all cars for logged-in user
exports.getUserCars = async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.userId });
        res.json(cars);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching cars' });
    }
};

// Search cars globally
exports.searchCars = async (req, res) => {
    const { keyword } = req.query;
    try {
        const cars = await Car.find({
            $or: [
                { title: new RegExp(keyword, 'i') },
                { description: new RegExp(keyword, 'i') },
                { tags: new RegExp(keyword, 'i') },
            ],
        });
        res.json(cars);
    } catch (err) {
        res.status(400).json({ error: 'Error searching cars' });
    }
};

// Update a car
exports.updateCar = async (req, res) => {
    const { id } = req.params;
    const { title, description, images, tags } = req.body;

    try {
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        if (car.owner.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        car.title = title || car.title;
        car.description = description || car.description;
        car.images = images || car.images;
        car.tags = tags || car.tags;

        await car.save();
        res.json(car);
    } catch (err) {
        res.status(400).json({ error: 'Error updating car' });
    }
};

// Delete a car
exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        if (car.owner.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        await car.remove();
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting car' });
    }
};
