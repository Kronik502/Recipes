const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Authentication routes
const Recipe = require('./models/Recipe');    // Recipe model
const jwt = require('jsonwebtoken');

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Middleware to parse JSON bodies
app.use(cors({ origin: 'http://localhost:5000' }));  // Enable CORS for React frontend

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);  
    process.exit(1);  
  });

// Authentication Middleware to Protect Routes
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  

  if (!token) return res.status(403).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.use('/api', authRoutes);  // Use authentication routes for /api

// Recipe Routes (CRUD)
app.post('/recipes', authenticateJWT, async (req, res) => {
  const { name, ingredients, instructions, category, preparationTime, cookingTime, servings, picture } = req.body.recipe;

  if (!name || !ingredients || !instructions || !category || !preparationTime || !cookingTime || !servings || !picture) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newRecipe = new Recipe({
    name,
    ingredients,
    instructions,
    category,
    preparationTime,
    cookingTime,
    servings,
    picture,
    userId: req.user.userId  // Associate recipe with authenticated user
  });

  try {
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error saving recipe:', err);
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

// Get all recipes of a user
app.get('/recipes', authenticateJWT, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.userId });
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
