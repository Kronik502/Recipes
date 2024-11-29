import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './login';
import RegistrationPage from './register';
import HomePage from './home';
import RecipeForm from './recipeform';
import Navbar from './navbar'; // Import Navbar
import { UserProvider } from './UserContext'; // Import the context provider

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar /> {/* Add Navbar here to be visible across all routes */}
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Register Route */}
          <Route path="/register" element={<RegistrationPage />} />

          {/* Recipe Form Route for adding and editing recipes */}
          <Route path="/add-recipe" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeForm />} /> {/* View or edit a specific recipe */}

          <Route path="/edit-recipe/:id" element={<RecipeForm />} /> {/* Editing a recipe */}

          {/* Home Route */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} /> {/* Default to Home or Login page */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
