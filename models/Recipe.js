const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  preparationTime: {
    type: String,
    required: true
  },
  cookingTime: {
    type: String,
    required: true
  },
  servings: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
