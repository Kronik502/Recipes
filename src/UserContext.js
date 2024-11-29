// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT to extract user info
      setUser(decodedToken.username); // Set user info (e.g., username)
    }
  }, []);

  // Set user data in localStorage and state
  const setUserInfo = (userInfo) => {
    localStorage.setItem('token', userInfo.token); // Store the token
    setUser(userInfo.username); // Set the user
  };

  // Remove user data from localStorage and clear state
  const clearUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUserInfo, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
