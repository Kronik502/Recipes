const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'db.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));  // Increase this as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Helper functions for data handling
const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { recipes: [], users: [] };
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
};

// User registration
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE).users;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };

  users.push(newUser);
  writeData(USERS_FILE, { users });

  res.status(201).json({ success: true, message: 'User registered' });
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE).users;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Return the username to be used in subsequent requests
  res.json({ username: user.username, message: 'Login successful' });
});

// Recipe CRUD operations
// Get all recipes for logged-in user
app.get('/recipes', (req, res) => {
  const { username } = req.query;  // Get the username from query params
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const data = readData(DATA_FILE);
  const userRecipes = data.recipes.filter(recipe => recipe.userId === username);

  res.json(userRecipes);
});

// Get a specific recipe by ID for logged-in user
app.get('/recipes/:id', (req, res) => {
  const { username } = req.query;  // Get the username from query params
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const data = readData(DATA_FILE);
  const { id } = req.params;

  const recipe = data.recipes.find(r => r.id === id && r.userId === username);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found or you do not have access to this recipe' });
  }
});

// Save a new recipe with Base64 image string
app.post('/recipes', (req, res) => {
  const { username } = req.body;  // Username must be passed in the request body
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const data = readData(DATA_FILE);
  const newRecipe = req.body.recipe;

  if (newRecipe.picture) {
    newRecipe.picture = newRecipe.picture; // Store the Base64 string
  }

  // Associate the recipe with the logged-in user
  newRecipe.userId = username;
  data.recipes.push(newRecipe);
  writeData(DATA_FILE, data);

  res.status(201).json(newRecipe);
});

// Edit a recipe by ID for logged-in user
app.put('/recipes/:id', (req, res) => {
  const { username } = req.body;  // Username passed in request body
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const data = readData(DATA_FILE);
  const { id } = req.params;

  const updatedRecipe = req.body.recipe;

  if (!id) {
    return res.status(400).json({ message: 'Recipe ID is missing' });
  }

  const recipeIndex = data.recipes.findIndex(r => r.id === id && r.userId === username);

  if (recipeIndex !== -1) {
    const recipeToUpdate = data.recipes[recipeIndex];

    const updatedRecipeData = {
      ...recipeToUpdate,
      ...updatedRecipe,
    };

    if (!updatedRecipe.picture) {
      updatedRecipeData.picture = recipeToUpdate.picture;
    }

    data.recipes[recipeIndex] = updatedRecipeData;
    writeData(DATA_FILE, data);

    res.json(updatedRecipeData);
  } else {
    res.status(404).json({ message: 'Recipe not found or you do not have access to this recipe' });
  }
});

// Delete a recipe by ID for logged-in user
app.delete('/recipes/:id', (req, res) => {
  const { username } = req.body;  // Username passed in request body
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const data = readData(DATA_FILE);
  const { id } = req.params;

  const updatedRecipes = data.recipes.filter(r => r.id !== id || r.userId !== username);

  if (updatedRecipes.length === data.recipes.length) {
    return res.status(404).json({ message: 'Recipe not found or you do not have access to this recipe' });
  }

  data.recipes = updatedRecipes;
  writeData(DATA_FILE, data);
  res.status(200).json({ message: 'Recipe deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
