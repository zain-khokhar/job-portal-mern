const express = require('express');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

// Simple signup route
router.post('/signup', signup);

// Simple signin route
router.post('/signin', signin);

module.exports = router;
