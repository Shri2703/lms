// src/Login.js
import React, { useState } from 'react';
import { RiUser3Line, RiLock2Line } from 'react-icons/ri';

const backendUrl = 'http://127.0.0.1:5000'; // Replace with your actual backend URL

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role === 'Admin') {
          window.location.href = '/admin/dashboard';
        } else if (data.role === 'Student') {
          window.location.href = '/student/dashboard';
        } else if (data.role === 'Evaluator') {
          window.location.href = '/evaluator/dashboard';
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-2/3 max-w-4xl">
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/path/to/your/image.jpg')` }}>
          <img src="login-card.png" alt="Library Background" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-maroon mb-2">Welcome Back</h2>
          <p className="text-maroon mb-4">Please sign in to continue</p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <RiUser3Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-maroon"
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
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-maroon"
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
                <label htmlFor="show-password" className="text-sm text-gray-700">Show password</label>
              </div>
              <a href="/forgot-password" className="text-sm text-maroon">Forgot password?</a>
            </div>
            <button type="submit" className="w-full py-2 bg-maroon text-white rounded-md hover:bg-maroon-dark transition duration-300">
              Login now
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
