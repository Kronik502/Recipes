import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in from localStorage
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    // Remove user from localStorage and navigate to login page
    localStorage.removeItem('username');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {user ? (
          <>
            <li>Hi, {user}</li>
            <li><button className="navbar-link" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link className="navbar-link" to="/login">Login</Link></li>
            <li><Link className="navbar-link" to="/register">Sign Up</Link></li>
          </>
        )}
        <li><Link className="navbar-link" to="/home">Home</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
