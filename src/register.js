import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError(''); // Reset previous error

    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
    
      alert(response.data.message); // Success message
      // Redirect to login page after successful registration
      navigate('/login'); // Ensure you navigate to the login page after successful registration
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error registering user');
      } else {
        setError('Unexpected error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
