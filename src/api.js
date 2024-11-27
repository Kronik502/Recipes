import axios from 'axios';

const API_URL = 'http://localhost:5000/recipes';

export const fetchRecipes = () => axios.get(API_URL);
export const addRecipe = (recipe) => axios.post(API_URL, recipe);
export const deleteRecipe = (id) => axios.delete(`${API_URL}/${id}`);
export const updateRecipe = (id, updatedRecipe) => axios.put(`${API_URL}/${id}`, updatedRecipe);
