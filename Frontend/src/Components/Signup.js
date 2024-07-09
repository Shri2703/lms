import React, { useState } from 'react';
import { RiUser3Line, RiLock2Line } from 'react-icons/ri';
import Loginbg from '../Images/loginbg.png';
import axios from 'axios';

const backendUrl = 'http://localhost:5000'; // Update if your backend URL is different

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/users/register`, {
        name: username,
        email,
        role,
        password,
      });

      if (response.status === 201) {
        window.location.href = '/login';
      } else {
        setError('Failed to sign up');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.msg || 'Failed to sign up');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${Loginbg})` }}></div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center border-y-4 border-maroon rounded-md">
          <h2 className="text-2xl font-bold text-maroon mb-2">Welcome to Clover Technologies</h2>
          <p className="text-maroon mb-4">Please sign up with your details to continue</p>
          <form onSubmit={handleSignup}>
            <div className="relative mb-4">
              <RiUser3Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-pink-100 focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
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
              <RiUser3Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-pink-100 focus:outline-none focus:ring-2 focus:ring-maroon"
              >
                <option value="">Select the role</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Evaluator">Evaluator</option>
              </select>
            </div>
            <div className="relative mb-4">
              <RiLock2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md bg-pink-100 focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div className="relative mb-4">
              <RiLock2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <label htmlFor="show-password" className="text-sm text-gray-700">Show password</label>
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-maroon text-white rounded-md hover:bg-maroon-dark transition duration-300">
              Sign up
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
