import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './recipe.css';

function RecipeForm() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    category: '',
    preparationTime: '',
    cookingTime: '',
    servings: '',
    picture: ''
  });
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { id } = useParams(); // Get the recipe ID from the URL, if any
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object to retrieve state passed to the component

  // Retrieve the username or token from location state or localStorage
  const username = location.state?.username || localStorage.getItem('username');
  const token = localStorage.getItem('token'); // JWT token stored in localStorage for authentication

  useEffect(() => {
    if (id) {
      // Fetch the recipe details from the server if editing
      axios.get(`http://localhost:5000/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setRecipe(response.data);
          setImagePreview(response.data.picture); // Set the image preview if available
        })
        .catch(error => {
          setError('Error fetching recipe. Please try again later.');
          console.error('Error fetching recipe:', error);
        });
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          picture: reader.result
        }));
        setImagePreview(reader.result); // Set the image preview for display
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors

    if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
      setError('Please fill in all required fields.');
      return; // Exit if required fields are empty
    }

    // Ensure ingredients is an array
    const ingredientsArray = typeof recipe.ingredients === 'string'
      ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
      : recipe.ingredients;

    const requestPayload = {
      recipe: {
        ...recipe, // Spread the recipe object to include all its fields
        ingredients: ingredientsArray, // Ensure ingredients is an array
      },
    };

    if (id) {
      // Update recipe if editing
      axios.put(`http://localhost:5000/recipes/${id}`, requestPayload, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          navigate('/'); // Redirect to the home page after successful update
        })
        .catch(error => {
          setError('Error updating recipe. Please try again later.');
          console.error('Error updating recipe:', error);
        });
    } else {
      // Add a new recipe if not editing
      axios.post('http://localhost:5000/recipes', requestPayload, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          navigate('/'); // Redirect to the home page after successful submission
        })
        .catch(error => {
          setError('Error adding recipe. Please try again later.');
          console.error('Error adding recipe:', error);
        });
    }
  };

  return (
    <div className="recipe-form-container">
      <h2>{id ? 'Edit Recipe' : 'Add New Recipe'}</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Recipe Name */}
        <label htmlFor="name">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required
        />

        {/* Ingredients */}
        <label htmlFor="ingredients">Ingredients (comma-separated)</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
        />

        {/* Instructions */}
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={recipe.category}
          onChange={handleChange}
        />

        {/* Preparation Time */}
        <label htmlFor="preparationTime">Preparation Time</label>
        <input
          type="text"
          id="preparationTime"
          name="preparationTime"
          value={recipe.preparationTime}
          onChange={handleChange}
        />

        {/* Cooking Time */}
        <label htmlFor="cookingTime">Cooking Time</label>
        <input
          type="text"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
        />

        {/* Servings */}
        <label htmlFor="servings">Servings</label>
        <input
          type="number"
          id="servings"
          name="servings"
          value={recipe.servings}
          onChange={handleChange}
        />

        {/* Image Upload */}
        <label htmlFor="picture">Recipe Picture</label>
        <input
          type="file"
          id="picture"
          name="picture"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" className="submit-button">
          {id ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;
