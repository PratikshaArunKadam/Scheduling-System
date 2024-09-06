import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email });
      const userId = response.data.userId;

      // Set the userId in localStorage
      localStorage.setItem('user', userId);
      localStorage.setItem('email', email);

      navigate('/home');
    } catch (error) {
      console.log(error);
      // Handle error, e.g., show a message to the user
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome </h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            required
          />
        </div>
      
        <div className="actions">
          <button type="submit" className="login-button">Sign in</button>
         
        </div>
 
      </form>
    </div>
  );
};

export default Login;
