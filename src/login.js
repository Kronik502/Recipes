import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Reset any previous error

    try {
      // Send login credentials to backend
      const response = await axios.post('http://localhost:5000/api/login', { username, password }, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Assuming the backend returns a token and username
      const { token, username: loggedInUser } = response.data;

      // Store the token and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', loggedInUser);

      // Redirect to homepage after successful login
      navigate('/home', { state: { username: loggedInUser } });
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message || 'Login failed');
      } else {
        setErrorMessage('Unexpected error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
