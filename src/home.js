import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext
import './home.css';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const { user } = useContext(UserContext); // Use context to get the user
  const token = localStorage.getItem('token'); // Get token from localStorage
  const navigate = useNavigate();

  // Fetch recipes when the component mounts or when token changes
  useEffect(() => {
    if (!user || !token) {
      setError('You need to log in first.');
      navigate('/login'); // Redirect to login if no user or token
      return;
    }

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/recipes', {
          headers: {
            'Authorization': `Bearer ${token}` // Pass token in the Authorization header
          }
        });

        if (Array.isArray(response.data)) {
          setRecipes(response.data);
          setFilteredRecipes(response.data); // Set the initial list of recipes
        } else {
          setError('Unexpected response format from the server.');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error.response || error.message);
        setError(`Error fetching recipes: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, token, navigate]);

  // Handle search input change and filter recipes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, recipes]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Pass the token in the Authorization header
        }
      });

      // Remove the deleted recipe from the list
      const updatedRecipes = recipes.filter(r => r._id !== id);
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
    } catch (error) {
      setError('Error deleting recipe. Please try again later.');
    }
  };

  return (
    <div className="home-container">
      <h2>Recipes</h2>
      {user && <h3>Welcome, {user}!</h3>} {/* User data from context */}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <button className="add-recipe-btn" onClick={() => navigate('/add-recipe')}>Add Recipe</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading State */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Display filtered recipes */}
      <div className="recipe-list">
        {filteredRecipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          filteredRecipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <h3>{recipe.name}</h3>
              <button onClick={() => handleDelete(recipe._id)} className="delete-btn">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
