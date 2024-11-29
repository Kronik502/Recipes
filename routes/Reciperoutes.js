const express = require('express');
const Recipe = require('../models/Recipe');
const authenticateJWT = require('../middleware/authenticateJWT'); // Path to your JWT authentication middleware

const router = express.Router();

// POST: Create a new recipe (requires authentication)
router.post('/recipes', authenticateJWT, async (req, res) => {
  const { title, ingredients, instructions, category, preptime, cooktime, servings, picture } = req.body;
  const userId = req.user.userId;

  if (!title || !ingredients || !instructions || !category || !preptime || !cooktime || !servings || !picture) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newRecipe = new Recipe({
    title,
    ingredients,
    instructions,
    category,
    preptime,
    cooktime,
    servings,
    picture,
    userId
  });

  try {
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

module.exports = router;
