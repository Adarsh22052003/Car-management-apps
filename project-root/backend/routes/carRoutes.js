const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { addCar, updateCar } = require('../controllers/carController');
const upload = require('../utils/uploadMiddleware');

const router = express.Router();

// Route to add a car (with images)
router.post('/', authenticate, upload.array('images', 10), addCar);

// Route to update car images
router.put('/:id', authenticate, upload.array('images', 10), updateCar);

module.exports = router;
