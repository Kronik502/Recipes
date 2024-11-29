const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize dotenv to use environment variables
dotenv.config();

const router = express.Router();

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3000',  // React frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
router.use(cors(corsOptions)); // Enable CORS for all routes in this router

// User Registration Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);  
    const user = new User({ username, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);  
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { userId: user._id, username: user.username } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
