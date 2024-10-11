// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css'; // Ensure you have your CSS styles

const Signup = () => {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post('http://localhost:3001/register', { mobileNumber, email, password, userType });
      console.log(response);

      // Store the userType in localStorage
      localStorage.setItem('userType', userType);

      toast.success('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.response?.data?.error || 'An error occurred.');
      toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className='signup-page signup-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='signup-form-container'>
        <h1>Sign-Up</h1>
        <label htmlFor="mobileNumber">Mobile Number:</label>
        <input
          type="text"
          id="mobileNumber"
          placeholder="Enter your Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
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
        <label htmlFor="userType">Role:</label>
        <select
          id="userType"
          name="userType"
          className='signup-select'
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="">Choose Your Role</option>
          <option value="HouseOwner">HouseOwner</option>
          <option value="Customer">Customer</option>
        </select>
        <input
          type="submit"
          value={loading ? "Signing up..." : "Sign-up"}
          className="signup-submit-btn"
          disabled={loading}
        />
        <span className='signup-already'>
          Already have an account? <a href="/login">Login</a>
        </span>
      </form>
    </div>
  );
};

export default Signup;
