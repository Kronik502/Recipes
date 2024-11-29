import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './navbar.css';

const Navbar = () => {
  const { user, clearUser } = useContext(UserContext);  // Destructuring only what's needed
  const navigate = useNavigate();

  // Handle logout functionality with error handling and redirection
  const handleLogout = async () => {
    try {
      clearUser(); // Remove user from context and localStorage
      navigate('/login'); // Redirect user to login page
    } catch (error) {
      console.error('Logout error: ', error); // In case of error, log it
    }
  };

  return (
    <nav className="navbar" role="navigation">
      <ul className="navbar-list">
        {user ? (
          <>
            <li>
              <span className="navbar-welcome">Hi, {user}</span>
            </li>
            <li>
              <button className="navbar-link" onClick={handleLogout} aria-label="Logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="navbar-link" to="/login" aria-label="Login">
                Login
              </Link>
            </li>
            <li>
              <Link className="navbar-link" to="/register" aria-label="Sign Up">
                Sign Up
              </Link>
            </li>
          </>
        )}
        <li>
          <Link className="navbar-link" to="/home" aria-label="Home">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
