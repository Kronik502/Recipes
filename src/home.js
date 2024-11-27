import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './home.css'; // Import your CSS file
import defaultImage from './default.jpg';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null); // State for expanded recipe
  const [error, setError] = useState(null); // Error state to capture API errors

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recipes');
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Set the recipes initially
      } catch (error) {
        setError('Error fetching recipes. Please try again later.');
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    // Debouncing search to improve performance
    const timeoutId = setTimeout(() => {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId); // Cleanup on next render
  }, [searchTerm, recipes]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowMore = (id) => {
    setExpandedRecipeId(prev => (prev === id ? null : id)); // Toggle expanded state, close others
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/recipes/${id}`);
      const updatedRecipes = recipes.filter(r => r.id !== id);
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes); // Update filteredRecipes after deletion
    } catch (error) {
      setError('Error deleting recipe. Please try again later.');
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div>
      <h2 className='title'>Recipes</h2>
      <input
        className='search'
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Link to="/add-recipe" className='add-button'>Add Recipe</Link>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="recipe-container">
        {filteredRecipes.map(recipe => {
          // Ensure ingredients is an array
          const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : recipe.ingredients.split(',');

          return (
            <div key={recipe.id} className="recipe-item">
              <img
                src={recipe.picture || defaultImage} // Use the Base64 string or fallback to default image
                alt={recipe.name}
                className={`recipe-image ${expandedRecipeId === recipe.id ? 'large-image' : ''}`} // Apply class conditionally
              />
              <div className="recipe-details">
                <h3>{recipe.name}</h3>
                {expandedRecipeId === recipe.id && (
                  <>
                    <p><strong>Ingredients:</strong> {ingredients.join(', ')}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    <p><strong>Category:</strong> {recipe.category}</p>
                    <p><strong>Preparation Time:</strong> {recipe.preparationTime}</p>
                    <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
                    <p><strong>Servings:</strong> {recipe.servings}</p>
                  </>
                )}
                <Link to={`/edit-recipe/${recipe.id}`} className='links'>Edit</Link>
                <button
                  onClick={() => handleShowMore(recipe.id)}
                  className={expandedRecipeId === recipe.id ? 'show-less-button' : 'show-more-button'}
                >
                  {expandedRecipeId === recipe.id ? 'Show Less' : 'Show More'}
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className='Deleteb'
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
