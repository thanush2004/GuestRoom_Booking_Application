// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'; // Ensure this CSS file contains the scoped classes we discussed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => { 
        setLoading(false);
        console.log(result.data); // Debugging: Log result to check what you receive
        if (result.data && result.data.token) {
          toast.success('Login successful! Redirecting...');
          localStorage.setItem('token', result.data.token); // Store token in localStorage
          const userType = result.data.userType; // Get userType from the response

          if (userType === "Customer") {
            navigate('/customer');  // Navigate to house owner dashboard
          } else {
            navigate('/houseowner');    // Navigate to customer dashboard
          }
        } else {
          toast.error('Login failed. Please try again.');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <div className="login-page-body">
    <div className='login-page'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='login-form-container'>
        <h1>Log in</h1>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter Your E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder='Enter Your Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="submit"
          value={loading ? "Logging in..." : "Log in"}
          className='login-submit-btn'
          disabled={loading}
        />
        <span className='login-already'>
          Already have an account? <a href="/Signup">Sign Up</a>
        </span>
      </form>
    </div>
    </div>
  );
};

export default Login;
