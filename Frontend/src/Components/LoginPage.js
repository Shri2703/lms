import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

import { RiUser3Line, RiLock2Line } from 'react-icons/ri';
import Loginbg from '../Images/loginbg.png';
import axios from 'axios';

const backendUrl = 'http://localhost:5000'; // Replace with your actual backend URL

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        

        // Decode the token to get user data
        const userData = jwt_decode(token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect based on user role
        if (userData.role === 'Admin') {
          navigate('/admindashboard');
        } else if (userData.role === 'Student') {
          navigate('/studentdashboard');
        } else if (userData.role === 'Evaluator') {
          navigate('/evaluatordashboard');
        }
      } else {
        setError('Invalid credentials in data');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        console.log('Error response data:', error.response.data);
        setError(error.response.data.msg || 'Invalid credentials');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${Loginbg})` }}
        >
          {/* The image will be visible only on md and larger screens */}
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center border-y-4 border-maroon rounded-md">
          <h2 className="text-2xl font-bold text-maroon mb-2">Welcome Back</h2>
          <p className="text-maroon mb-4">Please sign in to continue</p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <RiUser3Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-pink-100 focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div className="relative mb-4">
              <RiLock2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-pink-100 focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-password"
                  onChange={handleShowPassword}
                  className="mr-2"
                />
                <label htmlFor="show-password" className="text-sm text-gray-700">
                  Show password
                </label>
              </div>
              <a href="/forgot-password" className="text-sm text-maroon">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-maroon text-white rounded-md hover:bg-maroon-dark transition duration-300"
            >
              Login now
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
